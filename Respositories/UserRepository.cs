using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Constants;
using QaNet.Contracts.Repository;
using QaNet.CustomExceptions;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class UserRepository : RepositoryBase<User>, IUserRepository
	{
		public UserRepository(QaContext qaContext)
				: base(qaContext)
		{
		}

		public async Task<int> GetPointsAsync(string userId)
		{
			return (await this.FirstOrDefaultAsync(x => x.UserId == userId)).Points;
		}

		public async Task UpdatePointsAsync(Dictionary<string, int> pointsList)
		{
			foreach (var item in pointsList)
			{
				await this.UpdatePointsAsync(item.Key, item.Value);
			}
		}

		public async Task UpdatePointsAsync(string userId, int points)
		{
			if (points < 0)
			{
				await this.RevokePointsAsync(userId, points * -1);
			}
			else
			{
				await this.AddPointsAsync(userId, points);
			}
		}

		public async Task AddPointsAsync(string userId, int points)
		{
			var user = await this.FirstOrDefaultAsync(x => x.UserId == userId);

			if (user == null)
			{
				throw new QaException(Messages.NoRecords);
			}

			user.Points += points;
			this.Update(user);
		}

		public async Task RevokePointsAsync(string userId, int points)
		{
			var user = await this.FirstOrDefaultAsync(x => x.UserId == userId);
			if (user == null)
			{
				throw new QaException(Messages.NoRecords);
			}

			if (user.Points == 1)
			{
				return;
			}

			var pointsToUpdate = user.Points - points;

			if (pointsToUpdate < 1)
			{
				pointsToUpdate = 1;
			}

			user.Points = pointsToUpdate;
			this.Update(user);
		}
	}
}