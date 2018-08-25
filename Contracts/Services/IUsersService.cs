using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IUsersService
	{
		Task<IPaginate<PostsViewModel>> FetchQuestionListAsync(string userId, int index, int size = 20);

		Task<IPaginate<PostsViewModel>> FetchAnswersListAsync(string userId, int index, int size = 20);

		Task<IPaginate<PostsViewModel>> FetchBookmarksAsync(
			string userId,
			int index = 1,
			int size = 20
		);

		Task<UserProfileViewModelResponse> FetchUserProfileAsync(string userId);

		Task UpdateUserProfileAsync(string userId, UserProfileUpdateRequestViewModel profileVm); 

		Task<string> GetSerialNumberAsync(string userId);

		Task<User> FindUserAsync(string userId, string password);

		Task<User> FindUserAsync(string userId);

		Task UpdateUserLastActivityDateAsync(string userId);

		Task<User> GetCurrentUserAsync();

		string GetCurrentUserId();

		Task<(bool Succeeded, string Error)> ChangePasswordAsync(
			User user,
			string currentPassword,
			string newPassword);
	}
}