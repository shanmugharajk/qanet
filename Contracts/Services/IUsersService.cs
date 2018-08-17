using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Services
{
  public interface IUsersService
  {
    Task<string> GetSerialNumberAsync(string userId);

    Task<User> FindUserAsync(string userId, string password);

    Task<User> FindUserAsync(string userId);

    Task UpdateUserLastActivityDateAsync(string userId);

    Task<User> GetCurrentUser();

    string GetCurrentUserId();

    Task<(bool Succeeded, string Error)> ChangePasswordAsync(
      User user,
      string currentPassword,
      string newPassword);
  }
}