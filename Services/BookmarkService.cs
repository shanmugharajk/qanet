using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.Entities.Models;
using QaNet.Extensions;
using QaNet.Entities.ViewModels;
using System.Threading.Tasks;
using System.Collections.Generic;
using QaNet.Contracts.Paging;
using System;
using QaNet.CustomExceptions;
using QaNet.Constants;

namespace QaNet.Services
{
	public class BookmarkService : IBookmarkService
	{
		private IRepositoryWrapper repository;

		private IUnitOfWork uow;

		private IHttpContextAccessor httpContext;

		private IBookmarkRepository bookmarkRepository => this.repository.Bookmark;

		private IQuestionRepository questionRepository => this.repository.Question;

		private DbSet<Bookmark> bookmark => this.repository.Bookmark.GetEntity();

		private DbSet<Question> question => this.repository.Question.GetEntity();

		private DbSet<Answer> answer => this.repository.Answer.GetEntity();

		private string currentUser => this.httpContext?.HttpContext?.GetCurrentUserId();

		public BookmarkService(
			IHttpContextAccessor httpContext,
			IRepositoryWrapper repository,
			IUnitOfWork uow)
		{
			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(BookmarkService.repository));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(BookmarkService.uow));

			this.httpContext = httpContext;
			this.httpContext.CheckArgumentIsNull(nameof(BookmarkService.httpContext));
		}

		public async Task<int> AddToBookMarkAsync(int questionId)
		{
			var count = await this.bookmarkRepository.CountAsync(
				o => o.QuestionId == questionId && o.UserId == this.currentUser);

			if (count > 0)
			{
				throw new QaException("You have already bookmarked this question");
			}

			var bookmark = new Bookmark();
			bookmark.QuestionId = questionId;
			bookmark.UserId = this.currentUser;
			bookmark.CreatedAt = DateTime.Now;
			bookmark.UpdatedAt = DateTime.Now;

			await this.bookmarkRepository.AddAsync(bookmark);
			await this.uow.SaveChangesAsync();

			return await this.bookmarkRepository.CountAsync(
				o => o.QuestionId == questionId);
		}

		public async Task<int> DeleteBookmarkAsync(int questionId)
		{
			var bookmark = await this.bookmarkRepository
				.FirstAsync(x => x.UserId == this.currentUser && x.QuestionId == questionId);

			this.bookmarkRepository.Delete(bookmark);
			await this.uow.SaveChangesAsync();

			return await this.bookmarkRepository.CountAsync(
				o => o.QuestionId == questionId);
		}
	}
}