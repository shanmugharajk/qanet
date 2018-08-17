using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
	public interface IBookmarkRepository : IRepository<Bookmark>
	{
		Task<int> TotalBookmarksAsync(int questionId);

		Task<bool> IsBookmarkedAsync(int questionId, string userId);
	}
}