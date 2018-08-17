using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IAnswerCommentService
	{
		Task<IPaginate<CommentsViewModel>> FetchComments(int answerId, int index = 1);

		Task<IPaginate<CommentsViewModel>> FetchAllComments(int answerId);

		Task<BaseResponseViewModel> AddCommentAsync(int answerId, string comment);

		Task UpdateCommentAsync(int id, int answerId, string comment);

		Task DeleteCommentAsync(int commentId, int answerId);
	}
}