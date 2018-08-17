using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class QuestionVotersListRepository : RepositoryBase<QuestionVotersList>, IQuestionVotersListRepository
	{
		public QuestionVotersListRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task<bool> HasVotedAsync(int questionId, string author) =>
			await this.CountAsync(x => x.QuestionId == questionId && x.VoterId == author) > 0;

		public async Task<QuestionVotersList> FetchPreviousVote(int questionId, string author) =>
			await this.FirstOrDefaultAsync(x => x.QuestionId == questionId && x.VoterId == author);
	}
}