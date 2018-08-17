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
	public class QuestionVotingService : IQuestionVotingService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IQuestionRepository questionRepository => this.repository.Question;

		private IUserRepository userRepository => this.repository.User;

		private IQuestionVotersListRepository questionVoterListRepository
			=> this.repository.QuestionVotersList;

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public QuestionVotingService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(QuestionVotingService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(QuestionVotingService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(QuestionVotingService.httpContext));
		}

		public async Task<int> SaveVoteAsync(int questionId, int vote)
		{
			if (Votes.ValidVotes.Contains(vote) == false)
			{
				throw new QaException(Messages.InvalidVote);
			}

			var question = await this.questionRepository.FirstAsync(x => x.Id == questionId);

			await this.CheckUserCanVoteAsync(question, vote);

			var previousVote = await this.FetchPreviousVoteDetailByUserAsync(questionId, vote);

			this.ValidateVote(previousVote?.Vote, vote);

			await this.UpdateQuestionVoterListAsync(previousVote, vote, questionId);

			await this.UpdatePointsAsync(questionId, question.Author, previousVote?.Vote, vote);

			await this.uow.SaveChangesAsync();

			var newVote = (await this.questionRepository.FirstAsync(x => x.Id == questionId)).Votes;
			return newVote;
		}

		private async Task UpdatePointsAsync(
			int questionId,
			string questionAuthor,
			int? previousVote,
			int vote)
		{
			var (questionAuthorPoints, voterPoints, questionPoints) = this.GetPoints(previousVote, vote);

			// Update voter
			await this.userRepository.UpdatePointsAsync(this.currentUser, voterPoints);

			// Update questionaire
			await this.userRepository.UpdatePointsAsync(questionAuthor, questionAuthorPoints);

			var question = await this.questionRepository.FirstAsync(x => x.Id == questionId);

			question.Votes = question.Votes + questionPoints;
			this.questionRepository.Update(question);
		}

		private (int questionAuthorPoints, int voterPoints, int questionPoints) GetPoints(
			int? previousVote,
			int vote
		)
		{
			if (previousVote == null)
			{
				if (vote == Votes.UpVote)
				{
					return (questionAuthorPoints: 2, voterPoints: 0, questionPoints: 1);
				}
				else if (vote == Votes.DownVote)
				{
					return (questionAuthorPoints: -2, voterPoints: -2, questionPoints: -1);
				}
			}

			int questionAuthorPoints = 0, voterPoints = 0, questionPoints = 0;

			switch (vote)
			{
				case Votes.Zero:
					// upvote to zero | down vote to zero
					if (previousVote == Votes.UpVote)
					{
						questionPoints = -1;
						questionAuthorPoints = -2;
					}
					else
					{
						questionAuthorPoints = 2;
						questionPoints = 1;
						voterPoints = 2;
					}
					break;

				case Votes.UpVote:
					// down vote to upvote | zero to upvote
					if (previousVote == Votes.DownVote)
					{
						questionPoints = 2;
						questionAuthorPoints = 4;
						voterPoints = 2;
					}
					else
					{
						questionPoints = 1;
						questionAuthorPoints = 2;
					}
					break;

				case Votes.DownVote:
					voterPoints = -2;

					// upvote to down vote | zero to down vote
					if (previousVote == Votes.UpVote)
					{
						questionPoints = -2;
						questionAuthorPoints = -4;
					}
					else
					{
						questionPoints = -1;
						questionAuthorPoints = -2;
					}
					break;
			}

			return (questionAuthorPoints, voterPoints, questionPoints);
		}

		private async Task UpdateQuestionVoterListAsync(
			QuestionVotersList previousQuestionVotersList,
			int vote,
			int questionId)
		{
			if (previousQuestionVotersList == null)
			{
				var questionVotersListNew = new QuestionVotersList();
				questionVotersListNew.Vote = vote;
				questionVotersListNew.CreatedAt = DateTime.Now;
				questionVotersListNew.UpdatedAt = DateTime.Now;
				questionVotersListNew.VoterId = this.currentUser;
				questionVotersListNew.QuestionId = questionId;

				await this.questionVoterListRepository.AddAsync(questionVotersListNew);
			}
			else
			{
				var questionVotersListNew = new QuestionVotersList();
				questionVotersListNew.Vote = vote;
				questionVotersListNew.CreatedAt = previousQuestionVotersList.CreatedAt;
				questionVotersListNew.UpdatedAt = DateTime.Now;
				questionVotersListNew.VoterId = previousQuestionVotersList.VoterId;
				questionVotersListNew.QuestionId = previousQuestionVotersList.QuestionId;

				this.questionVoterListRepository.Update(questionVotersListNew);
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

		private async Task<QuestionVotersList> FetchPreviousVoteDetailByUserAsync(
			int questionId,
			int vote
		)
		{
			return await this.questionVoterListRepository
				.FirstOrDefaultAsync(x => x.QuestionId == questionId && x.VoterId == this.currentUser);
		}

		private async Task CheckUserCanVoteAsync(Question question, int vote)
		{
			if (question.Author == this.currentUser)
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