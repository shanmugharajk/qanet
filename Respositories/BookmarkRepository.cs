using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class BookmarkRepository : RepositoryBase<Bookmark>, IBookmarkRepository
	{
		public BookmarkRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task<int> TotalBookmarksAsync(int questionId) =>
			await this.CountAsync(x => x.QuestionId == questionId);

		public async Task<bool> IsBookmarkedAsync(int questionId, string userId) =>
			await this.CountAsync(x => x.QuestionId == questionId && x.UserId == userId) > 0;
	}
}