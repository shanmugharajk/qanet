using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IBookmarkService
	{
		Task<int> AddToBookMarkAsync(int questionId);

		Task<int> DeleteBookmarkAsync(int questionId);
	}
}