using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IQuestionCommentService
	{
		Task<IPaginate<CommentsViewModel>> FetchComments(int questionId, int index = 1);
		
		Task<IPaginate<CommentsViewModel>> FetchAllComments(int questionId);

		Task<BaseResponseViewModel> AddCommentAsync(int questionId, string comment);

		Task UpdateCommentAsync(int id, int questionId, string comment);

		Task DeleteCommentAsync(int id, int questionId);
	}
}