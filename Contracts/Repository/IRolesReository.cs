using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
  public interface IRolesRepository
  {
    Task<List<Role>> FindUserRolesAsync(string userId);

    Task<bool> IsUserInRoleAsync(string userId, string roleName);

    Task<List<User>> FindUsersInRoleAsync(string roleName);
  }
}