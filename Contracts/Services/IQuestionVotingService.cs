using System.Threading.Tasks;

namespace QaNet.Contracts.Services
{
	public interface IQuestionVotingService
	{
		Task<int> SaveVoteAsync(int questionId, int vote);
	}
}