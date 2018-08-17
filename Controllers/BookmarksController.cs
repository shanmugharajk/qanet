using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Domain;
using QaNet.Extensions;

namespace QaNet.Controllers
{
	[Route("api/[controller]")]
	[Authorize(Roles = CustomRoles.AllUsers)]
	public class BookmarksController : Controller
	{
		private IBookmarkService bookmarksService;

		public BookmarksController(IBookmarkService bookmarksService)
		{
			this.bookmarksService = bookmarksService;
			this.bookmarksService.CheckArgumentIsNull(nameof(BookmarksController.bookmarksService));
		}

		[HttpGet()]
		public async Task<IActionResult> FetchBookmarks(
			[FromQuery(Name = "index")] int indexParam,
			[FromQuery(Name = "size")] int size)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var bookmarksList = await this.bookmarksService.GetBookmarkedQuestionListAsync(index, size);
			return Ok(bookmarksList);
		}

		[HttpPost("{questionId}")]
		public async Task<IActionResult> AddBookmark(int questionId)
		{
			await this.bookmarksService.AddToBookMarkAsync(questionId);
			return NoContent();
		}

		[HttpDelete("{questionId}")]
		public async Task<IActionResult> DeleteBookmark(int questionId)
		{
			await this.bookmarksService.DeleteBookmarkAsync(questionId);
			return NoContent();
		}
	}
}