using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
  public class RolesRepository : IRolesRepository
  {
    private readonly DbSet<Role> roles;

    private readonly DbSet<User> users;

    public RolesRepository(QaContext dbContext)
    {
      this.roles = dbContext.Set<Role>();
      this.users = dbContext.Set<User>();
    }

    public Task<List<Role>> FindUserRolesAsync(string userId)
    {
      var userRolesQuery = from role in this.roles
                           from userRoles in role.UserRoles
                           where userRoles.UserId == userId
                           select role;

      return userRolesQuery.OrderBy(x => x.Name).ToListAsync();
    }

    public async Task<bool> IsUserInRoleAsync(string userId, string roleName)
    {
      var userRolesQuery = from role in this.roles
                           where role.Name == roleName
                           from user in role.UserRoles
                           where user.UserId == userId
                           select role;
      var userRole = await userRolesQuery.FirstOrDefaultAsync();
      return userRole != null;
    }

    public Task<List<User>> FindUsersInRoleAsync(string roleName)
    {
      var roleUserIdsQuery = from role in this.roles
                             where role.Name == roleName
                             from user in role.UserRoles
                             select user.UserId;
      return this.users.Where(user => roleUserIdsQuery.Contains(user.UserId))
                   .ToListAsync();
    }
  }
}