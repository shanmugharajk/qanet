using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
	public interface IAnswerVotersListRepository : IRepository<AnswerVotersList>
	{
		Task<bool> HasVotedAsync(int answerId, string author);

		Task<AnswerVotersList> FetchPreviousVote(int answerId, string author);
	}
}