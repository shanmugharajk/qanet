using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using QaNet.Contracts.Services;
using QaNet.Extensions;

namespace QaNet.Services
{
  public class TokenValidatorService : ITokenValidatorService
  {
    private readonly IUsersService usersService;
    private readonly ITokenStoreService tokenStoreService;

    public TokenValidatorService(IUsersService usersService, ITokenStoreService tokenStoreService)
    {
      this.usersService = usersService;
      this.usersService.CheckArgumentIsNull(nameof(usersService));

      this.tokenStoreService = tokenStoreService;
      this.tokenStoreService.CheckArgumentIsNull(nameof(TokenValidatorService.tokenStoreService));
    }

    public async Task ValidateAsync(TokenValidatedContext context)
    {
      var userPrincipal = context.Principal;

      var claimsIdentity = context.Principal.Identity as ClaimsIdentity;
      if (claimsIdentity?.Claims == null || !claimsIdentity.Claims.Any())
      {
        context.Fail("This is not our issued token. It has no claims.");
        return;
      }

      var serialNumberClaim = claimsIdentity.FindFirst(ClaimTypes.SerialNumber);
      if (serialNumberClaim == null)
      {
        context.Fail("This is not our issued token. It has no serial.");
        return;
      }

      var userId = claimsIdentity.FindFirst(ClaimTypes.UserData).Value;

      var user = await this.usersService.FindUserAsync(userId);
      if (user == null || user.SerialNumber != serialNumberClaim.Value || !user.IsActive)
      {
        // user has changed his/her password/roles/stat/IsActive
        context.Fail("This token is expired. Please login again.");
      }

      var accessToken = context.SecurityToken as JwtSecurityToken;
      if (accessToken == null || string.IsNullOrWhiteSpace(accessToken.RawData) ||
          !await this.tokenStoreService.IsValidTokenAsync(accessToken.RawData, userId))
      {
        context.Fail("This token is not in our database.");
        return;
      }

      await this.usersService.UpdateUserLastActivityDateAsync(userId);
    }
  }
}