using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class QuestionRepository : RepositoryBase<Question>, IQuestionRepository
	{
		private readonly DbSet<Answer> answers;

		public QuestionRepository(QaContext qaContext)
		: base(qaContext)
		{
			this.answers = qaContext.Set<Answer>();
		}

		public async Task<int> GetVotesAsync(int questionId) =>
			 await this.CountAsync(x => x.Id == questionId && x.Votes > 0);

		public async Task<bool> HasRightsToModifyAsync(string userId) =>
			(await this.CountAsync(x => x.Author == userId)) > 0;


		public async Task<bool> HasAcceptedAnswerAsync(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return await query.CountAsync() > 0;
		}

		public async Task<int> GetAnswersCountAsync(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return await query.CountAsync();
		}

		public bool HasAcceptedAnswer(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return query.Count() > 0;
		}

		public int GetAnswersCount(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return query.Count();
		}
	}
}