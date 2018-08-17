using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Repository
{
	public interface IAnswerCommentRepository : IRepository<AnswerComment>
	{
		Task<IPaginate<CommentsViewModel>> FetchComments(int answerId, int index = 1);

		Task<IPaginate<CommentsViewModel>> FetchAllComments(int answerId);
	}
}