using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Repository
{
	public interface IQuestionRepository : IRepository<Question>
	{
		Task<int> GetVotesAsync(int questionId);

		Task<bool> HasRightsToModifyAsync(string userId);

		Task<int> GetAnswersCountAsync(int questionId);

		Task<bool> HasAcceptedAnswerAsync(int questionId);

		Task InsertIntoSearchTableAsync(int questionId, string title);

		Task UpdateSearchTableAsync(int questionId, string title);

		Task<IPaginate<QuestionsSearch>> SearchQuestion(
			string searchText,
			int index,
			int size = 10);

		int GetAnswersCount(int questionId);

		bool HasAcceptedAnswer(int questionId);
	}
}