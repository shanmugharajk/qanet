using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class AnswerVotersListRepository : RepositoryBase<AnswerVotersList>, IAnswerVotersListRepository
	{
		public AnswerVotersListRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task<bool> HasVotedAsync(int answerId, string author) =>
			await this.CountAsync(x => x.AnswerId == answerId && x.VoterId == author) > 0;

		public async Task<AnswerVotersList> FetchPreviousVote(int answerId, string author) =>
			await this.FirstOrDefaultAsync(x => x.AnswerId == answerId && x.VoterId == author);
	}
}