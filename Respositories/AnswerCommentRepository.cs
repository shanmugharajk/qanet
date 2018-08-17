using System.Linq;
using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Respositories
{
	public class AnswerCommentRepository : RepositoryBase<AnswerComment>, IAnswerCommentRepository
	{
		public AnswerCommentRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task<IPaginate<CommentsViewModel>> FetchComments(
			int answerId,
			int index = 1)
		{
			return await this.dbSet
			 .Where(x => x.AnswerId == answerId)
			 .Select(x => new CommentsViewModel
			 {
				 Id = x.Id,
				 Comment = x.Comment,
				 Author = x.Author,
				 CommentedAt = x.CreatedAt
			 }).ToPaginateAsync(index, 5);
		}

		public async Task<IPaginate<CommentsViewModel>> FetchAllComments(int answerId)
		{
			return await this.dbSet
			 .Where(x => x.AnswerId == answerId)
			 .Select(x => new CommentsViewModel
			 {
				 Id = x.Id,
				 Comment = x.Comment,
				 Author = x.Author,
				 CommentedAt = x.CreatedAt
			 }).ToPaginateAsync(0, 100000); // TODO: Change this. For time being its ok.
		}
	}
}