using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class UserRoleRepository : RepositoryBase<UserRole>, IUserRoleRepository
	{
		public UserRoleRepository(QaContext qaContext)
		: base(qaContext)
		{
		}
	}
}