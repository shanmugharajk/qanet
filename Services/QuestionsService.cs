using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using QaNet.Constants;
using QaNet.Contracts.Paging;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;
using QaNet.Respositories;

namespace QaNet.Services
{
	public class QuestionsService : IQuestionsService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		private IQuestionRepository questionsRepository => this.repository.Question;

		private IQuestionCommentRepository commentsRepository => this.repository.QuestionComment;

		private IQuestionVotersListRepository questionVoteRepository => this.repository.QuestionVotersList;

		private IBookmarkRepository bookmarksRepository => this.repository.Bookmark;

		private IQuestionTagRepository questionTagRepository => this.repository.QuestionTag;

		private IUserRepository usersRepository => this.repository.User;

		private IAnswerRepository answersRepository => this.repository.Answer;

		public QuestionsService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(QuestionsService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(QuestionsService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(QuestionsService.httpContext));
		}

		public async Task<QuestionsListResponseViewModel> FetchQuestionListAsync(
			int index,
			int size = 20)
		{
			// TODO : This needs to changed to single query. For now this is fine.
			var questions = await this.questionsRepository
				.GetListAsync(orderBy: order => order.OrderByDescending(x => x.Id),
					include: source => source.Include(x => x.QuestionTags)
						.ThenInclude(t => t.Question),
					index: index,
					size: size
			);

			var questionsList = new List<QuestionBaseViewModel>();
			foreach (var q in questions.Items)
			{
				QuestionBaseViewModel temp = await this.GetQuestionDetailResponseAsync(q, false);
				questionsList.Add(temp);
			}

			var result = new QuestionsListResponseViewModel();
			result.Items = questionsList;
			result.Index = questions.Index;
			result.Size = questions.Size;
			result.Count = questions.Count;
			result.Pages = questions.Pages;
			result.HasPrevious = questions.HasPrevious;
			result.HasNext = questions.HasNext;

			return result;
		}

		public async Task<QuestionDetailResponseViewModel> FetchQuestionAsync(int questionId)
		{
			var question = await this.questionsRepository
				.FirstAsync(predicate: x => x.Id == questionId,
					include: source => source.Include(x => x.QuestionTags));

			var result = await this.GetQuestionDetailResponseAsync(question, true);
			return result as QuestionDetailResponseViewModel;
		}

		private async Task<QuestionBaseViewModel> GetQuestionDetailResponseAsync(
			Question question, bool isList = false)
		{
			var authorPoints = await this.usersRepository.GetPointsAsync(question.Author);

			// TODO move this to auto mapper
			var questionViewModel = new QuestionDetailResponseViewModel();
			questionViewModel.Id = question.Id;
			questionViewModel.Title = question.Title;

			if (isList == true)
			{
				questionViewModel.Question = question.QuestionText;
			}
			questionViewModel.Tags = question.QuestionTags.Select(o => o.TagId).ToList();

			if (isList == true)
			{
				questionViewModel.Comments = await this.commentsRepository.GetEntity()
				.Where(x => x.QuestionId == question.Id)
				.Select(x => new CommentsViewModel
				{
					Id = x.Id,
					Comment = x.Comment,
					Author = x.Author,
					CommentedAt = x.CreatedAt
				}).ToPaginateAsync(0, 5);
			}

			questionViewModel.OwnQuestion = this.currentUser == question.Author;
			questionViewModel.Votes = question.Votes;
			questionViewModel.BountyExpiry = question.BountyExpiryDate;
			questionViewModel.Author = question.Author;
			questionViewModel.AuthorPoints = authorPoints;
			questionViewModel.BountyPoints = question.BountyPoints;
			questionViewModel.CreatedAt = question.CreatedAt;
			questionViewModel.UpdatedAt = question.UpdatedAt;

			questionViewModel.TotalAnswers =
				await this.answersRepository.TotalAnswersAsync(question.Id);
			questionViewModel.HasAcceptedAnswer =
				await this.answersRepository.HasAcceptedAnswerAsync(question.Id);
			questionViewModel.TotalBookmarks =
				await this.bookmarksRepository.TotalBookmarksAsync(question.Id);
			questionViewModel.SelfBookmarked =
				await this.bookmarksRepository.IsBookmarkedAsync(question.Id, question.Author);
			questionViewModel.SelfVoted =
				await this.questionVoteRepository.HasVotedAsync(question.Id, this.currentUser);
			questionViewModel.SelfVote =
				(await this.questionVoteRepository.FetchPreviousVote(question.Id, this.currentUser))?.Vote;

			return questionViewModel;
		}

		public async Task AddBountyAsync(int questionId, int points)
		{
			var question = await this.questionsRepository.FirstAsync(x => x.Id == questionId);

			if (question.Author != this.currentUser)
			{
				throw new QaException(Messages.NoRightsToModifyQuestion);
			}

			var userPoints = await this.usersRepository.GetPointsAsync(this.currentUser);
			var bountyPoints = 50 * points;

			if (userPoints < 50)
			{
				throw new QaException(Messages.NotEligibleForBounty);
			}

			if (userPoints < bountyPoints)
			{
				throw new QaException(Messages.InSufficientPoints);
			}

			question.BountyPoints = bountyPoints;
			question.BountyExpiryDate = DateTime.Now.AddDays(5);

			this.questionsRepository.Update(question);
			await this.uow.SaveChangesAsync();
		}

		public async Task DeleteQuestionAsync(int questionId)
		{
			if ((await this.questionsRepository.HasRightsToModifyAsync(this.currentUser)) == false)
			{
				throw new QaException(Messages.NoRightsToModifyQuestion);
			}

			var hasUpvotes = await this.questionsRepository.GetVotesAsync(questionId) > 0;
			var hasAnswers = await this.questionsRepository.GetAnswersCountAsync(questionId) > 0;

			if (hasUpvotes == true)
			{
				throw new QaException(Messages.CantDeleteSinceItHasUpVotes);
			}
			if (hasAnswers == true)
			{
				throw new QaException(Messages.CantDeleteSinceItHasAnswer);
			}

			this.questionsRepository.DeleteById(questionId);
			await this.uow.SaveChangesAsync();
		}

		public async Task<BaseResponseViewModel> AddQuestionAsync(
			QuestionRequestViewModel questionRequestViewModel)
		{
			var question = new Question();
			question.QuestionText = questionRequestViewModel.Question;
			question.Title = questionRequestViewModel.Title;
			question.ShortDescription = questionRequestViewModel.ShortDescription;
			question.CreatedAt = DateTime.Now;
			question.UpdatedAt = DateTime.Now;
			question.Author = this.currentUser;

			await this.questionsRepository.AddAsync(question);

			await this.questionTagRepository.AddTagsToAQuestion(questionRequestViewModel.Tags, question.Id);

			await this.uow.SaveChangesAsync();

			return new BaseResponseViewModel() { Id = question.Id };
		}

		public async Task UpdateQuestionAsync(
			int questionId,
			QuestionRequestViewModel questionRequestViewModel)
		{
			var question = await this.questionsRepository.FirstAsync(x => x.Id == questionId);

			if (question.Author != this.currentUser)
			{
				throw new QaException(Messages.NoRightsToModifyQuestion);
			}

			question.QuestionText = questionRequestViewModel.Question;
			question.Title = questionRequestViewModel.Title;
			question.ShortDescription = questionRequestViewModel.ShortDescription;
			question.UpdatedAt = DateTime.Now;

			await this.questionTagRepository.DeleteAllRelatedToAQuestion(questionId);

			await this.questionTagRepository.AddTagsToAQuestion(questionRequestViewModel.Tags, question.Id);

			this.questionsRepository.Update(question);

			await this.uow.SaveChangesAsync();
		}
	}
}