using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
  public class UserTokenRepository : RepositoryBase<UserToken>, IUserTokenRepository
  {
    public UserTokenRepository(QaContext QaContext)
    : base(QaContext)
    {
    }
  }
}