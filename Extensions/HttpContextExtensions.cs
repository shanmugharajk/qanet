using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace QaNet.Extensions
{
  public static class HttpContextExtensions
  {
    public static string GetCurrentUserId(this HttpContext self)
    {
      var claimsIdentity = self.User?.Identity as ClaimsIdentity;
      var userDataClaim = claimsIdentity?.FindFirst(ClaimTypes.UserData);
      var userId = userDataClaim?.Value;
      return userId;
    }
  }
}