using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
	public class QuestionCommentService : IQuestionCommentService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IQuestionCommentRepository questionCommentRepository => this.repository.QuestionComment;

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public QuestionCommentService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(QuestionCommentService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(QuestionCommentService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(QuestionCommentService.httpContext));
		}

		public async Task<IPaginate<CommentsViewModel>> FetchComments(int questionId, int index = 1) =>
			await this.questionCommentRepository.FetchComments(questionId, index);

		public async Task<IPaginate<CommentsViewModel>>FetchAllComments(int questionId) =>
			await this.questionCommentRepository.FetchAllComments(questionId);

		public async Task<BaseResponseViewModel> AddCommentAsync(int questionId, string comment)
		{
			var questionComment = new QuestionComment();
			questionComment.Comment = comment;
			questionComment.QuestionId = questionId;
			questionComment.CreatedAt = DateTime.Now;
			questionComment.UpdatedAt = DateTime.Now;
			questionComment.Author = this.currentUser;

			await this.questionCommentRepository.AddAsync(questionComment);
			await this.uow.SaveChangesAsync();

			var response = new BaseResponseViewModel();
			response.Id = questionComment.Id;

			return response;
		}

		public async Task UpdateCommentAsync(int id, int questionId, string comment)
		{
			var questionComment = await this.CheckRightsAndFetchCommentAsync(id);

			questionComment.UpdatedAt = DateTime.Now;
			questionComment.Comment = comment;

			this.questionCommentRepository.Update(questionComment);
			await this.uow.SaveChangesAsync();
		}

		public async Task DeleteCommentAsync(int id, int questionId)
		{
			var questionComment = await this.CheckRightsAndFetchCommentAsync(id);

			this.questionCommentRepository.DeleteById(id);
			await this.uow.SaveChangesAsync();
		}

		private async Task<QuestionComment> CheckRightsAndFetchCommentAsync(int id)
		{
			var questionComment = await this.questionCommentRepository.FirstAsync(x => x.Id == id);

			if (questionComment.Author != currentUser)
			{
				throw new QaException(Messages.NoRightsToModifyComment);
			}

			return questionComment;
		}
	}
}