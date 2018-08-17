using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.Entities.Domain;
using QaNet.Entities.Models;
using QaNet.Extensions;

namespace QaNet.Services
{
	public class TokenStoreService : ITokenStoreService
	{
		private readonly ISecurityService securityService;

		private readonly IUnitOfWork uow;

		private readonly IOptionsSnapshot<BearerTokensOptions> configuration;

		private readonly IRolesRepository rolesRepository;

		private readonly IUserTokenRepository userTokenRepository;

		public TokenStoreService(
				IUnitOfWork uow,
				ISecurityService securityService,
				IRepositoryWrapper repository,
				IOptionsSnapshot<BearerTokensOptions> configuration)
		{
			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(TokenStoreService.uow));

			this.securityService = securityService;
			this.securityService.CheckArgumentIsNull(nameof(TokenStoreService.securityService));

			this.rolesRepository = repository.Roles;
			this.rolesRepository.CheckArgumentIsNull(nameof(rolesRepository));

			this.userTokenRepository = repository.UserToken;
			this.userTokenRepository.CheckArgumentIsNull(nameof(userTokenRepository));

			this.configuration = configuration;
			this.configuration.CheckArgumentIsNull(nameof(configuration));
		}

		public async Task AddUserTokenAsync(UserToken userToken)
		{
			if (!this.configuration.Value.AllowMultipleLoginsFromTheSameUser)
			{
				await InvalidateUserTokensAsync(userToken.UserId);
			}
			await DeleteTokensWithSameRefreshTokenSourceAsync(userToken.RefreshTokenIdHashSource);
			await this.userTokenRepository.AddAsync(userToken);
		}

		public async Task AddUserTokenAsync(User user, string refreshToken, string accessToken, string refreshTokenSource)
		{
			var now = DateTimeOffset.UtcNow;
			var token = new UserToken
			{
				UserId = user.UserId,
				// Refresh token handles should be treated as secrets and should be stored hashed
				RefreshTokenIdHash = this.securityService.GetSha256Hash(refreshToken),
				RefreshTokenIdHashSource = string.IsNullOrWhiteSpace(refreshTokenSource) ?
																		 null : securityService.GetSha256Hash(refreshTokenSource),
				AccessTokenHash = this.securityService.GetSha256Hash(accessToken),
				RefreshTokenExpiresDateTime = now.AddMinutes(this.configuration.Value.RefreshTokenExpirationMinutes),
				AccessTokenExpiresDateTime = now.AddMinutes(this.configuration.Value.AccessTokenExpirationMinutes)
			};
			await AddUserTokenAsync(token);
		}

		public async Task DeleteExpiredTokensAsync()
		{
			var now = DateTimeOffset.UtcNow;

			var tokens = this.userTokenRepository.GetAsync(x => x.RefreshTokenExpiresDateTime < now);

			await tokens.ToAsyncEnumerable().ForEachAsync(userToken =>
				{
					this.userTokenRepository.Delete(userToken);
				});
		}

		public async Task DeleteTokenAsync(string refreshToken)
		{
			var token = await FindTokenAsync(refreshToken);
			if (token != null)
			{
				this.userTokenRepository.Delete(token);
			}
		}

		public async Task DeleteTokensWithSameRefreshTokenSourceAsync(string refreshTokenIdHashSource)
		{
			if (string.IsNullOrWhiteSpace(refreshTokenIdHashSource))
			{
				return;
			}

			var tokens = this.userTokenRepository.GetAsync(t => t.RefreshTokenIdHashSource == refreshTokenIdHashSource);

			await tokens.ToAsyncEnumerable().ForEachAsync(userToken =>
				{
					this.userTokenRepository.Delete(userToken);
				});
		}

		public async Task RevokeUserBearerTokensAsync(string userId, string refreshToken)
		{
			if (this.configuration.Value.AllowSignoutAllUserActiveClients)
			{
				await InvalidateUserTokensAsync(userId);
			}

			if (!string.IsNullOrWhiteSpace(refreshToken))
			{
				var refreshTokenIdHashSource = this.securityService.GetSha256Hash(refreshToken);
				await DeleteTokensWithSameRefreshTokenSourceAsync(refreshTokenIdHashSource);
			}

			await DeleteExpiredTokensAsync();
		}

		public Task<UserToken> FindTokenAsync(string refreshToken)
		{
			if (string.IsNullOrWhiteSpace(refreshToken))
			{
				return null;
			}
			var refreshTokenIdHash = this.securityService.GetSha256Hash(refreshToken);
			return this.userTokenRepository.FirstOrDefaultAsync(
					include: source => source.Include(u => u.User),
					predicate: x => x.RefreshTokenIdHash == refreshTokenIdHash);
		}

		public async Task InvalidateUserTokensAsync(string userId)
		{
			var tokens = await this.userTokenRepository.GetAsync(predicate: x => x.UserId == userId);
			await tokens.ToAsyncEnumerable().ForEachAsync(userToken =>
			 {
				 this.userTokenRepository.Delete(userToken);
			 });
		}

		public async Task<bool> IsValidTokenAsync(string accessToken, string userId)
		{
			var accessTokenHash = this.securityService.GetSha256Hash(accessToken);
			var userToken = await this.userTokenRepository.FirstOrDefaultAsync(
					predicate: x => x.AccessTokenHash == accessTokenHash && x.UserId == userId);

			return userToken?.AccessTokenExpiresDateTime >= DateTimeOffset.UtcNow;
		}

		public async Task<(string accessToken, string refreshToken, IEnumerable<Claim> Claims)> CreateJwtTokensAsync(User user, string refreshTokenSource)
		{
			var result = await createAccessTokenAsync(user);
			var refreshToken = Guid.NewGuid().ToString().Replace("-", "");
			await AddUserTokenAsync(user, refreshToken, result.AccessToken, refreshTokenSource);
			await this.uow.SaveChangesAsync();

			return (result.AccessToken, refreshToken, result.Claims);
		}

		private async Task<(string AccessToken, IEnumerable<Claim> Claims)> createAccessTokenAsync(User user)
		{
			var claims = new List<Claim>
						{
                // Unique Id for all Jwt tokes
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString(), ClaimValueTypes.String,  this.configuration.Value.Issuer),
                // Issuer
                new Claim(JwtRegisteredClaimNames.Iss,  this.configuration.Value.Issuer, ClaimValueTypes.String,  this.configuration.Value.Issuer),
                // Issued at
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64,  this.configuration.Value.Issuer),
								new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString(), ClaimValueTypes.String,  this.configuration.Value.Issuer),
								new Claim(ClaimTypes.Name, user.UserId, ClaimValueTypes.String,  this.configuration.Value.Issuer),
								new Claim("DisplayName", user.DisplayName, ClaimValueTypes.String,  this.configuration.Value.Issuer),
                // to invalidate the cookie
                new Claim(ClaimTypes.SerialNumber, user.SerialNumber, ClaimValueTypes.String,  this.configuration.Value.Issuer),
                // custom data
                new Claim(ClaimTypes.UserData, user.UserId.ToString(), ClaimValueTypes.String,  this.configuration.Value.Issuer)
						};

			// add roles
			var roles = await rolesRepository.FindUserRolesAsync(user.UserId);
			foreach (var role in roles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role.Name, ClaimValueTypes.String, this.configuration.Value.Issuer));
			}

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.configuration.Value.Key));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var now = DateTime.UtcNow;
			var token = new JwtSecurityToken(
					issuer: this.configuration.Value.Issuer,
					audience: this.configuration.Value.Audience,
					claims: claims,
					notBefore: now,
					expires: now.AddMinutes(this.configuration.Value.AccessTokenExpirationMinutes),
					signingCredentials: creds);
			return (new JwtSecurityTokenHandler().WriteToken(token), claims);
		}
	}
}