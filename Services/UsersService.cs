using System;
using System.Linq;
using System.Security.Claims;
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
	public class UsersService : IUsersService
	{
		private readonly IUnitOfWork uow;

		private IRepositoryWrapper repository;

		private IUserRepository usersRepository => this.repository.User;

		private IRolesRepository rolesRepository => this.repository.Roles;

		private IUserRoleRepository userRoleRepository => this.repository.UserRole;

		private IQuestionRepository questionsRepository => this.repository.Question;

		private IBookmarkRepository bookmarksRepository => this.repository.Bookmark;

		private IAnswerRepository answersRepository => this.repository.Answer;

		private readonly ISecurityService securityService;

		private readonly IHttpContextAccessor contextAccessor;

		private string currentUser => this.contextAccessor?.HttpContext?.GetCurrentUserId();

		public UsersService(
			IUnitOfWork uow,
			IRepositoryWrapper repository,
			ISecurityService securityService,
			IHttpContextAccessor contextAccessor)
		{
			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(UsersService.uow));

			this.repository = repository;
			this.repository.CheckArgumentIsNull(nameof(UsersService.repository));

			this.securityService = securityService;
			this.securityService.CheckArgumentIsNull(nameof(UsersService.securityService));

			this.contextAccessor = contextAccessor;
			this.contextAccessor.CheckArgumentIsNull(nameof(UsersService.contextAccessor));
		}

		public async Task SignUp(UserSignUpRequestViewModel userSignUpVm)
		{
			var existing = await this.usersRepository.FirstOrDefaultAsync(x => x.UserId == userSignUpVm.UserId);

			if (existing != null)
			{
				throw new QaException(Messages.UserIdAlreadyExists);
			}

			var newUser = new User
			{
				UserId = userSignUpVm.UserId,
				DisplayName = userSignUpVm.DisplayName,
				IsActive = true,
				LastLoggedIn = null,
				Password = this.securityService.GetSha256Hash(userSignUpVm.Password),
				SerialNumber = Guid.NewGuid().ToString("N"),
				Points = 1,
				CreatedAt = DateTime.Now,
				UpdatedAt = DateTime.Now,
			};

			await this.usersRepository.AddAsync(newUser);

			var userRole = await this.rolesRepository.FirstAsync(x => x.Name == "User");

			await this.userRoleRepository.AddAsync(new UserRole { RoleId = userRole.Id, UserId = newUser.UserId });

			await this.uow.SaveChangesAsync();
		}

		public async Task<UserProfileViewModelResponse> FetchUserProfileAsync(string userId)
		{
			var profile = await this.usersRepository.FirstAsync(x => x.UserId == userId);

			var profileViewModel = new UserProfileViewModelResponse();
			profileViewModel.UserId = profile.UserId;
			profileViewModel.DisplayName = profile.DisplayName;
			profileViewModel.JoinedAt = profile.CreatedAt;
			profileViewModel.Points = profile.Points;
			profileViewModel.About = profile.About;

			return profileViewModel;
		}

		public async Task UpdateUserProfileAsync(string userId, UserProfileUpdateRequestViewModel profileVm)
		{
			var profile = await this.usersRepository.FirstAsync(x => x.UserId == userId);

			profile.About = profileVm.About;
			profile.DisplayName = profileVm.DisplayName;

			this.usersRepository.Update(profile);
			await this.uow.SaveChangesAsync();
		}

		public async Task<IPaginate<PostsViewModel>> FetchBookmarksAsync(
			string userId,
			int index = 1,
			int size = 20
		)
		{
			var result = from bookmark in this.bookmarksRepository.GetEntity()
									 join question in this.questionsRepository.GetEntity()
											on bookmark.QuestionId equals question.Id
									 where bookmark.UserId == userId
									 select new PostsViewModel
									 {
										 Title = question.Title,
										 Id = question.Id,
										 Votes = question.Votes,
									 };

			var bookmarksList = await result.ToPaginateAsync(index, size);

			// This is because of async behaviour creates problem.
			// TODO Check this later.
			// https://stackoverflow.com/questions/48767910/entity-framework-core-a-second-operation-started-on-this-context-before-a-previ
			foreach (var item in bookmarksList.Items)
			{
				item.HasAcceptedAnswer = await this.questionsRepository.HasAcceptedAnswerAsync(item.Id);
			}

			return bookmarksList;
		}

		public async Task<IPaginate<PostsViewModel>> FetchQuestionListAsync(
			string userId,
			int index,
			int size = 20
			)
		{
			return await this.questionsRepository.GetEntity()
				.Where(o => o.Author == userId)
				.Select(q => new PostsViewModel
				{
					Id = q.Id,
					Title = q.Title,
					Votes = q.Votes,
					HasAcceptedAnswer = this.answersRepository.GetEntity()
						.Any(a => a.QuestionId == q.Id && a.IsAccepted == true),
					AnswersCount = this.answersRepository.GetEntity()
						.Count(a => a.QuestionId == q.Id)
				}).ToPaginateAsync(index, size);
		}

		public async Task<IPaginate<PostsViewModel>> FetchAnswersListAsync(
			string userId,
			int index,
			int size = 20
			)
		{
			var answers = this.answersRepository.GetEntity();
			var questions = this.questionsRepository.GetEntity();

			var result = from answer in answers
									 join question in questions on answer.QuestionId equals question.Id
									 where answer.Author == userId
									 select new PostsViewModel
									 {
										 Id = question.Id,
										 Title = question.Title,
										 Votes = answer.Votes,
										 HasAcceptedAnswer = answer.IsAccepted,
										 FragmentToNavigate = answer.Id.ToString()
									 };

			return await result.ToPaginateAsync(index, size);
		}

		public Task<User> FindUserAsync(string userId)
		{
			return this.usersRepository.FirstAsync(x => x.UserId == userId);
		}

		public Task<User> FindUserAsync(string userId, string password)
		{
			var passwordHash = this.securityService.GetSha256Hash(password);
			return this.usersRepository.FirstOrDefaultAsync(
				x => x.UserId == userId && x.Password == passwordHash);
		}

		public async Task<string> GetSerialNumberAsync(string userId)
		{
			var user = await FindUserAsync(userId);
			return user.SerialNumber;
		}

		public async Task UpdateUserLastActivityDateAsync(string userId)
		{
			var user = await FindUserAsync(userId);
			if (user.LastLoggedIn != null)
			{
				var updateLastActivityDate = TimeSpan.FromMinutes(2);
				var currentUtc = DateTimeOffset.UtcNow;
				var timeElapsed = currentUtc.Subtract(user.LastLoggedIn.Value);
				if (timeElapsed < updateLastActivityDate)
				{
					return;
				}
			}
			user.LastLoggedIn = DateTimeOffset.UtcNow;
			await this.uow.SaveChangesAsync();
		}

		public string GetCurrentUserId()
		{
			var claimsIdentity = this.contextAccessor.HttpContext.User.Identity as ClaimsIdentity;
			var userDataClaim = claimsIdentity?.FindFirst(ClaimTypes.UserData);
			var userId = userDataClaim?.Value;
			return userId;
		}

		public Task<User> GetCurrentUserAsync()
		{
			var userId = GetCurrentUserId();
			return FindUserAsync(userId);
		}

		public async Task<(bool Succeeded, string Error)> ChangePasswordAsync(
			User user,
			string currentPassword,
			string newPassword)
		{
			var currentPasswordHash = this.securityService.GetSha256Hash(currentPassword);
			if (user.Password != currentPasswordHash)
			{
				return (false, "Current password is wrong.");
			}

			user.Password = this.securityService.GetSha256Hash(newPassword);
			// user.SerialNumber = Guid.NewGuid().ToString("N"); // To force other logins to expire.
			await this.uow.SaveChangesAsync();
			return (true, string.Empty);
		}
	}
}