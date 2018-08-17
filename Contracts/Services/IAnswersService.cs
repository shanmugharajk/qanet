using System.Threading.Tasks;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IAnswersService
	{
		Task<AnswersListResponseViewModel> FetchAnswers(
			int questionId,
			int index,
			int size = 5
		);

		Task<BaseResponseViewModel> AddAnswerAsync(int questionId, string answer);

		Task DeleteAnswerAsync(int questionId, int answerId);

		Task UpdateAnswerAsync(int questionId, int answerId, string answer);

		Task AcceptAnswerAsync(int questionId, int answerId);
	}
}