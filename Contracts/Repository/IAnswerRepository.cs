using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
	public interface IAnswerRepository : IRepository<Answer>
	{
		Task<int> TotalAnswersAsync(int questionId);

		Task<bool> HasAcceptedAnswerAsync(int questionId);
	}
}