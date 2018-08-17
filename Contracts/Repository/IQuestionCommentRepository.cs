using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Repository
{
	public interface IQuestionCommentRepository : IRepository<QuestionComment>
	{
		Task<IPaginate<CommentsViewModel>> FetchComments(int questionId, int index = 1);

		Task<IPaginate<CommentsViewModel>> FetchAllComments(int questionId);
	}
}