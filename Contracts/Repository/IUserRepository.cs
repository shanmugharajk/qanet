using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
	public interface IUserRepository : IRepository<User>
	{
		Task<int> GetPointsAsync(string userId);

		Task UpdatePointsAsync(string userId, int points);

		Task UpdatePointsAsync(Dictionary<string, int> pointsList);

		Task AddPointsAsync(string userId, int points);

		Task RevokePointsAsync(string userId, int points);
	}
}