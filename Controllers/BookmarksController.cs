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

		[HttpPost("{questionId}")]
		[AllowAnonymous]
		public async Task<IActionResult> AddBookmark(int questionId)
		{
			var totalBookmarkCount = await this.bookmarksService.AddToBookMarkAsync(questionId);
			return Ok(totalBookmarkCount);
		}

		[HttpDelete("{questionId}")]
		public async Task<IActionResult> DeleteBookmark(int questionId)
		{
			var totalBookmarkCount = await this.bookmarksService.DeleteBookmarkAsync(questionId);
			return Ok(totalBookmarkCount);
		}
	}
}