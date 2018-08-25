using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QaNet.Contracts.Services;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Controllers
{
	[Route("api/[controller]")]
	public class UsersController : Controller
	{
		private IUsersService usersService;

		public UsersController(IUsersService usersService)
		{
			this.usersService = usersService;
			this.usersService.CheckArgumentIsNull(nameof(UsersController.usersService));
		}

		[AllowAnonymous]
		[HttpGet("{userId}/questions")]
		public async Task<IActionResult> GetQuestionsByUser(
			string userId,
			[FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var questionsList = await this.usersService.FetchQuestionListAsync(userId, index);
			return Ok(questionsList);
		}

		[AllowAnonymous]
		[HttpGet("{userId}/answers")]
		public async Task<IActionResult> GetAnswersByUser(
			string userId,
			[FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var questionsList = await this.usersService.FetchAnswersListAsync(userId, index);
			return Ok(questionsList);
		}

		[AllowAnonymous]
		[HttpGet("{userId}/bookmarks")]
		public async Task<IActionResult> FetchBookmarks(
			string userId,
			[FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var bookmarksList = await this.usersService.FetchBookmarksAsync(userId, index);
			return Ok(bookmarksList);
		}

		[AllowAnonymous]
		[HttpGet("{userId}/profile")]
		public async Task<IActionResult> FetchUserProfile(string userId)
		{
			var profile = await this.usersService.FetchUserProfileAsync(userId);
			return Ok(profile);
		}

		[HttpPut("{userId}/profile")]
		public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody]UserProfileUpdateRequestViewModel uvm)
		{
			await this.usersService.UpdateUserProfileAsync(userId, uvm);
			return NoContent();
		}
	}
}