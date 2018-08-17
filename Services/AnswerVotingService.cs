using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using QaNet.Constants;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Models;
using QaNet.Extensions;

namespace QaNet.Services
{
	public class AnswerVotingService : IAnswerVotingService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IQuestionRepository questionRepository => this.repository.Question;

		private IAnswerRepository answerRepository => this.repository.Answer;

		private IUserRepository userRepository => this.repository.User;

		private IAnswerVotersListRepository answerVoterListRepository
			=> this.repository.AnswerVotersList;
		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public AnswerVotingService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(AnswerVotingService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(AnswerVotingService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(AnswerVotingService.httpContext));
		}

		public async Task<int> SaveVoteAsync(int answerId, int vote)
		{
			if (Votes.ValidVotes.Contains(vote) == false)
			{
				throw new QaException(Messages.InvalidVote);
			}

			var answer = await this.answerRepository.FirstAsync(x => x.Id == answerId);

			await this.CheckUserCanVoteAsync(answer, vote);

			var previousVote = await this.FetchPreviousVoteDetailByUserAsync(answerId, vote);

			this.ValidateVote(previousVote?.Vote, vote);

			await this.UpdateAnswerVoterListAsync(previousVote, vote, answerId);

			await this.UpdatePointsAsync(answerId, answer.Author, previousVote?.Vote, vote);

			await this.uow.SaveChangesAsync();

			var newVote = (await this.answerRepository.FirstAsync(x => x.Id == answerId)).Votes;
			return newVote;
		}

		private async Task UpdatePointsAsync(
			int answerId,
			string answerAuthor,
			int? previousVote,
			int vote)
		{
			var (answerAuthorPoints, voterPoints, answerPoints) = this.GetPoints(previousVote, vote);

			// Update voter
			await this.userRepository.UpdatePointsAsync(this.currentUser, voterPoints);

			// Update questionaire
			await this.userRepository.UpdatePointsAsync(answerAuthor, answerAuthorPoints);

			var answer = await this.answerRepository.FirstAsync(x => x.Id == answerId);

			answer.Votes = answer.Votes + answerPoints;
			this.answerRepository.Update(answer);
		}

		private (int answerAuthorPoints, int voterPoints, int answerPoints) GetPoints(
					int? previousVote,
					int vote
				)
		{
			if (previousVote == null)
			{
				if (vote == Votes.UpVote)
				{
					return (answerAuthorPoints: 5, voterPoints: 0, answerPoints: 1);
				}
				else if (vote == Votes.DownVote)
				{
					return (answerAuthorPoints: -5, voterPoints: -2, answerPoints: -1);
				}
			}

			int answerAuthorPoints = 0, voterPoints = 0, answerPoints = 0;

			switch (vote)
			{
				case Votes.Zero:
					// upvote to zero | down vote to zero
					if (previousVote == Votes.UpVote)
					{
						answerPoints = -1;
						answerAuthorPoints = -5;
					}
					else
					{
						answerPoints = 1;
						answerAuthorPoints = 5;
						voterPoints = 2;
					}
					break;

				case Votes.UpVote:
					// down vote to upvote | zero to upvote
					if (previousVote == Votes.DownVote)
					{
						answerPoints = 2;
						answerAuthorPoints = 10;
						voterPoints = 2;
					}
					else
					{
						answerPoints = 1;
						answerAuthorPoints = 5;
					}
					break;

				case Votes.DownVote:
					voterPoints = -2;

					// upvote to down vote | zero to down vote
					if (previousVote == Votes.UpVote)
					{
						answerPoints = -2;
						answerAuthorPoints = -10;
					}
					else
					{
						answerPoints = -1;
						answerAuthorPoints = -5;
					}
					break;
			}

			return (answerAuthorPoints, voterPoints, answerPoints);
		}
		private async Task UpdateAnswerVoterListAsync(
			AnswerVotersList previousQuestionVotersList,
			int vote,
			int answerId)
		{
			if (previousQuestionVotersList == null)
			{
				var questionVotersListNew = new AnswerVotersList();
				questionVotersListNew.Vote = vote;
				questionVotersListNew.CreatedAt = DateTime.Now;
				questionVotersListNew.UpdatedAt = DateTime.Now;
				questionVotersListNew.VoterId = this.currentUser;
				questionVotersListNew.AnswerId = answerId;

				await this.answerVoterListRepository.AddAsync(questionVotersListNew);
			}
			else
			{
				var questionVotersListNew = new AnswerVotersList();
				questionVotersListNew.Vote = vote;
				questionVotersListNew.CreatedAt = previousQuestionVotersList.CreatedAt;
				questionVotersListNew.UpdatedAt = DateTime.Now;
				questionVotersListNew.VoterId = previousQuestionVotersList.VoterId;
				questionVotersListNew.AnswerId = previousQuestionVotersList.AnswerId;

				this.answerVoterListRepository.Update(questionVotersListNew);
			}
		}

		private void ValidateVote(
				int? previousVote,
				int vote)
		{
			var hasPreviousVote = previousVote != null;

			// has previous vote and now voting for the same or
			// no previous vote and trying to undo the same.
			if (hasPreviousVote == true && previousVote == vote ||
				hasPreviousVote == false && vote == Votes.Zero)
			{
				throw new QaException(Messages.InvalidVote);
			}
		}

		private async Task<AnswerVotersList> FetchPreviousVoteDetailByUserAsync(
			int answerId,
			int vote
		)
		{
			return await this.answerVoterListRepository
				.FirstOrDefaultAsync(x => x.AnswerId == answerId && x.VoterId == this.currentUser);
		}

		private async Task CheckUserCanVoteAsync(Answer answer, int vote)
		{
			if (answer.Author == this.currentUser)
			{
				throw new QaException(Messages.CantVoteOwnPost);
			}

			var userPoints = await this.userRepository.GetPointsAsync(this.currentUser);

			if (vote == Votes.DownVote && userPoints < 150)
			{
				throw new QaException(Messages.CantDownVote);
			}

			if (vote == Votes.UpVote && userPoints < 25)
			{
				throw new QaException(Messages.CantUpVote);
			}
		}
	}
}