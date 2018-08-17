using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using QaNet.Constants;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Models;
using QaNet.Extensions;

namespace QaNet.Services
{
	public class UsersService : IUsersService
	{
		private readonly IUnitOfWork uow;

		private readonly IUserRepository users;

		private readonly ISecurityService securityService;

		private readonly IHttpContextAccessor contextAccessor;

		public UsersService(
				IUnitOfWork uow,
				IRepositoryWrapper repository,
				ISecurityService securityService,
				IHttpContextAccessor contextAccessor)
		{
			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(UsersService.uow));

			this.users = repository.User;

			this.securityService = securityService;
			this.securityService.CheckArgumentIsNull(nameof(UsersService.securityService));

			this.contextAccessor = contextAccessor;
			this.contextAccessor.CheckArgumentIsNull(nameof(UsersService.contextAccessor));
		}

		public Task<User> FindUserAsync(string userId)
		{
			return this.users.FirstAsync(x => x.UserId == userId);
		}

		public Task<User> FindUserAsync(string userId, string password)
		{
			var passwordHash = this.securityService.GetSha256Hash(password);
			return this.users.FirstAsync(x => x.UserId == userId && x.Password == passwordHash);
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

		public Task<User> GetCurrentUser()
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