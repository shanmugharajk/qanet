using System.Threading.Tasks;

namespace QaNet.Contracts.Services
{
	public interface IAnswerVotingService
	{
		Task<int> SaveVoteAsync(int answerId, int vote);
	}
}