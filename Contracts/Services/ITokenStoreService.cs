using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Services
{
  public interface ITokenStoreService
  {
    Task AddUserTokenAsync(UserToken userToken);

    Task AddUserTokenAsync(User user, string refreshToken, string accessToken, string refreshTokenSource);

    Task<bool> IsValidTokenAsync(string accessToken, string userId);

    Task DeleteExpiredTokensAsync();

    Task<UserToken> FindTokenAsync(string refreshToken);

    Task DeleteTokenAsync(string refreshToken);

    Task DeleteTokensWithSameRefreshTokenSourceAsync(string refreshTokenIdHashSource);

    Task InvalidateUserTokensAsync(string userId);

    Task<(string accessToken, string refreshToken, IEnumerable<Claim> Claims)> CreateJwtTokensAsync(User user, string refreshTokenSource);

    Task RevokeUserBearerTokensAsync(string userIdValue, string refreshToken);
  }
}