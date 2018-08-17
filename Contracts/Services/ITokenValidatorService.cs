using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace QaNet.Contracts.Services
{
  public interface ITokenValidatorService
  {
    Task ValidateAsync(TokenValidatedContext context);
  }
}