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
	public class AnswerCommentService : IAnswerCommentService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IAnswerCommentRepository answerCommentRepository => this.repository.AnswerComment;

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public AnswerCommentService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(AnswerCommentService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(AnswerCommentService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(AnswerCommentService.httpContext));
		}

		public async Task<IPaginate<CommentsViewModel>> FetchAllComments(int answerId) =>
			await this.answerCommentRepository.FetchAllComments(answerId);

		public async Task<IPaginate<CommentsViewModel>> FetchComments(int answerId, int index = 1) =>
			await this.answerCommentRepository.FetchComments(answerId, index);

		public async Task<BaseResponseViewModel> AddCommentAsync(int answerId, string comment)
		{
			var answerComment = new AnswerComment();
			answerComment.Comment = comment;
			answerComment.AnswerId = answerId;
			answerComment.CreatedAt = DateTime.Now;
			answerComment.UpdatedAt = DateTime.Now;
			answerComment.Author = this.currentUser;

			await this.answerCommentRepository.AddAsync(answerComment);
			await this.uow.SaveChangesAsync();

			var response = new BaseResponseViewModel() { Id = answerComment.Id };
			return response;
		}

		public async Task UpdateCommentAsync(int id, int answerId, string comment)
		{
			var answerComment = await this.CheckRightsAndFetchCommentAsync(id);

			answerComment.UpdatedAt = DateTime.Now;
			answerComment.Comment = comment;

			this.answerCommentRepository.Update(answerComment);
			await this.uow.SaveChangesAsync();
		}

		public async Task DeleteCommentAsync(int commentId, int answerId)
		{
			var answerComment = await this.CheckRightsAndFetchCommentAsync(commentId);

			this.answerCommentRepository.DeleteById(commentId);
			await this.uow.SaveChangesAsync();
		}

		private async Task<AnswerComment> CheckRightsAndFetchCommentAsync(int id)
		{
			var answerComment = await this.answerCommentRepository.FirstAsync(x => x.Id == id);

			if (answerComment.Author != currentUser)
			{
				throw new QaException(Messages.NoRightsToModifyComment);
			}

			return answerComment;
		}
	}
}