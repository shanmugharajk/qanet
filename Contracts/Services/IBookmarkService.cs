using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
  public interface IBookmarkService
  {
    Task<IPaginate<BookmarkViewModel>> GetBookmarkedQuestionListAsync(
      int index = 1,
      int size = 20
    );

    Task AddToBookMarkAsync(int questionId);

    Task DeleteBookmarkAsync(int questionId);
  }
}