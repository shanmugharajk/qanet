using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
	public interface IQuestionVotersListRepository : IRepository<QuestionVotersList>
	{
		Task<bool> HasVotedAsync(int questionId, string author);

		Task<QuestionVotersList> FetchPreviousVote(int questionId, string author);
	}
}