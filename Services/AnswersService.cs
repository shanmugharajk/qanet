using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QaNet.Constants;
using QaNet.Contracts.Paging;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Services
{
	public class AnswersService : IAnswersService
	{
		private const int PointsForquestioner = 2;

		private const int PointsForAnswerer = 10;

		private IRepositoryWrapper repository;

		private Question question;

		private Answer currentAcceptedAnswer;

		private Answer previousAcceptedAnswer;

		Dictionary<string, int> pointsToUpdate;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IAnswerVotersListRepository answerVoteRepository => this.repository.AnswerVotersList;

		private IAnswerRepository answersRepository => this.repository.Answer;

		private IUserRepository usersRepository => this.repository.User;

		private IQuestionRepository questionsRepository => this.repository.Question;

		private IAnswerCommentRepository commentsRepository => this.repository.AnswerComment;

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public AnswersService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(AnswersService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(AnswersService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(AnswersService.httpContext));
		}


		// Gets the list of answers available for the question.
		public async Task<AnswersListResponseViewModel> FetchAnswers(
			int questionId,
			int index,
			int size = 5
		)
		{
			var answers = await this.answersRepository
				.GetListAsync(predicate: x => x.QuestionId == questionId,
					orderBy: order => order.OrderBy(x => x.Id),
					index: index,
					size: size
			);

			var answersList = new List<AnswerDetailViewModel>();
			foreach (var answer in answers.Items)
			{
				answersList.Add(await this.GetAnswerDetailResponseReponseAsync(answer));
			}

			var result = new AnswersListResponseViewModel();
			result.Items = answersList;
			result.Index = answers.Index;
			result.Size = answers.Size;
			result.Count = answers.Count;
			result.Pages = answers.Pages;
			result.HasPrevious = answers.HasPrevious;
			result.HasNext = answers.HasNext;

			return result;
		}

		public async Task<AnswerDetailViewModel> FetchAnswer(int questionId, int answerId)
		{
			var answer = await this.answersRepository
				.FirstOrDefaultAsync(predicate: x => x.QuestionId == questionId && x.Id == answerId);

			return await this.GetAnswerDetailResponseReponseAsync(answer);
		}

		// Adds new answer.
		public async Task<BaseResponseViewModel> AddAnswerAsync(int questionId, string answer)
		{
			var newAnswer = new Answer();
			newAnswer.QuestionId = questionId;
			newAnswer.AnswerText = answer;
			newAnswer.CreatedAt = DateTime.Now;
			newAnswer.CreatedAt = DateTime.Now;
			newAnswer.Author = this.currentUser;

			await this.answersRepository.AddAsync(newAnswer);
			await this.uow.SaveChangesAsync();

			return new BaseResponseViewModel() { Id = newAnswer.Id };
		}

		// Delete's the answer.
		public async Task DeleteAnswerAsync(int questionId, int answerId)
		{
			var answer = await this.CheckAndFetchAnswerAsync(questionId, answerId);
			this.answersRepository.Delete(answer);
			await this.uow.SaveChangesAsync();
		}

		// Updates the answer.
		public async Task UpdateAnswerAsync(int questionId, int answerId, string answer)
		{
			var oldAnswer = await this.CheckAndFetchAnswerAsync(questionId, answerId);

			oldAnswer.AnswerText = answer;
			oldAnswer.CreatedAt = DateTime.Now;

			this.answersRepository.Update(oldAnswer);
			await this.uow.SaveChangesAsync();
		}

		// Updates the accepted answer in Answer table and updates the points for 
		// Question, Answer (current, previous accepted) author's.
		public async Task AcceptAnswerAsync(int questionId, int answerId)
		{
			this.currentAcceptedAnswer = await this.answersRepository
			.FirstAsync(x => x.Id == answerId && x.QuestionId == questionId);

			this.question = await this.questionsRepository
				.FirstAsync(x => x.Id == questionId);

			if (this.question.Author != this.currentUser)
			{
				throw new QaException(Messages.CantAcceptAnswerForOthersQuestion);
			}

			this.previousAcceptedAnswer = await this.answersRepository
				.FirstOrDefaultAsync(x => x.QuestionId == questionId && x.IsAccepted == true);

			this.UpdateAnswersTableForAnswerAccept(questionId, answerId);

			await this.UpdatePointsAsync();

			await this.uow.SaveChangesAsync();
		}

		// Updates points - Question, Answer (current, previous accepted) author's
		private async Task UpdatePointsAsync()
		{
			this.pointsToUpdate = new Dictionary<string, int>();

			// New answer
			if (this.previousAcceptedAnswer == null)
			{
				this.UpdatePointsOnNewAnswer();
			}
			else
			{
				this.UpdatePointsWhenOldAnswerAvailable();
			}

			this.UpdateBountyPoints();

			await this.usersRepository.UpdatePointsAsync(this.pointsToUpdate);
		}

		// Checks the eligibility for the bounty points and updates points for the question author,
		// previous accepted answer author, current accepted answer author.
		private void UpdateBountyPoints()
		{
			var previousBounty = this.FetchBountyPoints(this.question, this.previousAcceptedAnswer);
			var currentBounty = this.FetchBountyPoints(this.question, this.currentAcceptedAnswer);

			// Present answer is available for bounty.
			if (previousBounty == 0 && currentBounty != 0)
			{
				this.pointsToUpdate[this.question.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.question.Author) - currentBounty;
				this.pointsToUpdate[this.currentAcceptedAnswer.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.currentAcceptedAnswer.Author) + currentBounty;
			} // Previous answer is available for bounty.
			else if (previousBounty != 0 && currentBounty == 0)
			{
				this.pointsToUpdate[this.question.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.question.Author) + previousBounty;
				this.pointsToUpdate[this.previousAcceptedAnswer.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.previousAcceptedAnswer.Author) - previousBounty;
			} // Both the answers are eligible for bounty.
			else if (previousBounty != 0 && currentBounty != 0)
			{
				this.pointsToUpdate[this.previousAcceptedAnswer.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.previousAcceptedAnswer.Author) - previousBounty;
				this.pointsToUpdate[this.currentAcceptedAnswer.Author] =
					this.pointsToUpdate.GetValueOrDefault(this.currentAcceptedAnswer.Author) + currentBounty;
			}
		}

		// Updates points to the answer (previous, current) author. This will be called only when there is previous answer.
		private void UpdatePointsWhenOldAnswerAvailable()
		{
			// Same answer again - toggle
			if (this.currentAcceptedAnswer.Id == this.previousAcceptedAnswer.Id)
			{
				// own answer
				if (this.currentAcceptedAnswer.Author == this.question.Author)
				{
					return;
				}
				else // diff answer
				{
					this.pointsToUpdate[this.currentAcceptedAnswer.Author] = PointsForAnswerer * -1;
					this.pointsToUpdate[this.question.Author] = PointsForquestioner * -1;
				}
			}
			else // diff answer
			{
				// Own answer - Diff answer
				if (this.previousAcceptedAnswer.Author == this.question.Author &&
						this.currentAcceptedAnswer.Author != this.question.Author)
				{
					this.pointsToUpdate[this.currentAcceptedAnswer.Author] = PointsForAnswerer;
					this.pointsToUpdate[this.question.Author] = PointsForquestioner;
				} // Diff answer - Own answer
				else if (this.previousAcceptedAnswer.Author != this.question.Author &&
					this.currentAcceptedAnswer.Author == this.question.Author)
				{
					this.pointsToUpdate[this.previousAcceptedAnswer.Author] = PointsForAnswerer * -1;
					this.pointsToUpdate[this.question.Author] = PointsForquestioner * -1;
				} // Diff answer - Diff answer
				else
				{
					this.pointsToUpdate[this.previousAcceptedAnswer.Author] = PointsForAnswerer * -1;
					this.pointsToUpdate[this.currentAcceptedAnswer.Author] = PointsForAnswerer;
				}
			}
		}

		// Updates the question, answer author. This will be called be only when no answer previous answer.
		private void UpdatePointsOnNewAnswer()
		{
			// Own answer
			if (this.currentAcceptedAnswer.Author == this.question.Author)
			{
				return;
			}
			else // Diff answer
			{
				this.pointsToUpdate[currentAcceptedAnswer.Author] = PointsForAnswerer;
				this.pointsToUpdate[question.Author] = PointsForquestioner;
			}
		}

		// Updates the answer table with the latest accepted answer.
		private void UpdateAnswersTableForAnswerAccept(int questionId, int answerId)
		{
			// Update the accepted answer to 'Answer' table
			this.currentAcceptedAnswer.IsAccepted = true;

			// Accepting same answer mean undo.
			if (this.currentAcceptedAnswer.Id == this.previousAcceptedAnswer?.Id)
			{
				this.currentAcceptedAnswer.IsAccepted = false;
				this.answersRepository.Update(currentAcceptedAnswer);
			} // No previous accepted answer.
			else if (this.previousAcceptedAnswer == null)
			{
				this.answersRepository.Update(currentAcceptedAnswer);
			}
			else
			{
				this.previousAcceptedAnswer.IsAccepted = false;
				this.answersRepository.Update(previousAcceptedAnswer);
				this.answersRepository.Update(currentAcceptedAnswer);
			}
		}

		// Forms the response object needs to sent.
		private async Task<AnswerDetailViewModel> GetAnswerDetailResponseReponseAsync(Answer answer)
		{
			var answerDetailViewModel = new AnswerDetailViewModel();
			answerDetailViewModel.Id = answer.Id;
			answerDetailViewModel.Answer = answer.AnswerText;
			answerDetailViewModel.Votes = answer.Votes;
			answerDetailViewModel.Author = answer.Author;
			answerDetailViewModel.AuthorPoints = await this.usersRepository.GetPointsAsync(answer.Author);
			answerDetailViewModel.CreatedAt = answer.CreatedAt;
			answerDetailViewModel.UpdatedAt = answer.UpdatedAt;
			answerDetailViewModel.IsAccepted = answer.IsAccepted;

			answerDetailViewModel.SelfVote =
				(await this.answerVoteRepository.FetchPreviousVote(answer.Id, this.currentUser))?.Vote;

			answerDetailViewModel.SelfVoted =
				await this.answerVoteRepository.HasVotedAsync(answer.Id, this.currentUser);

			answerDetailViewModel.Comments = await this.commentsRepository.GetEntity()
				.Where(x => x.AnswerId == answer.Id)
				.Select(x => new CommentsViewModel
				{
					Id = x.Id,
					Comment = x.Comment,
					Author = x.Author,
					CommentedAt = x.CreatedAt
				}).ToPaginateAsync(0, 5);

			return answerDetailViewModel;
		}

		// Fetched the bounty points for the question and answer sent.
		private int FetchBountyPoints(Question question, Answer answer)
		{
			DateTime bountyExpiryDate;
			if (question.BountyExpiryDate == null ||
					question.BountyPoints == null ||
					DateTime.TryParse(question.BountyExpiryDate.ToString(), out bountyExpiryDate) == false)
			{
				return 0;
			}

			var isExpired = answer.CreatedAt.Subtract(bountyExpiryDate).Days > 0;

			if (isExpired == true)
			{
				return 0;
			}
			else
			{
				return (int)question.BountyPoints;
			}
		}

		// Checks whether the current logged in user is eligible to modify the answer.
		private async Task<Answer> CheckAndFetchAnswerAsync(int questionId, int answerId)
		{
			var answer = await this.answersRepository
				.FirstAsync(x => x.Id == answerId && x.QuestionId == questionId);

			if (answer.Author != this.currentUser)
			{
				throw new QaException(Messages.NoRightsToModifyAnswer);
			}

			if (answer.IsAccepted == true)
			{
				throw new QaException(Messages.CantDeleteSinceItsAcceptedAnswer);
			}

			return answer;
		}
	}
}