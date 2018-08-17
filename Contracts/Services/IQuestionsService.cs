using System.Threading.Tasks;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IQuestionsService
	{
		Task<QuestionsListResponseViewModel> FetchQuestionListAsync(int index, int size = 20);

		Task<QuestionDetailResponseViewModel> FetchQuestionAsync(int questionId);

		Task<BaseResponseViewModel> AddQuestionAsync(
			QuestionRequestViewModel questionRequestViewModel);

		Task UpdateQuestionAsync(
			int questionId,
			QuestionRequestViewModel questionRequestViewModel);

		Task AddBountyAsync(int questionId, int points);

		Task DeleteQuestionAsync(int questionId);
	}
}