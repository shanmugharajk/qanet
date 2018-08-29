using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using QaNet.Contracts.Paging;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Contracts.Services
{
	public interface IQuestionsService
	{
		Task<QuestionsListResponseViewModel> FetchQuestionListAsync(
			int index,
			int size = 20,
			Expression<Func<Question, bool>> predicate = null);

		Task<QuestionDetailResponseViewModel> FetchQuestionAsync(int questionId);

		Task<QuestionsListResponseViewModel> SearchQuestions(
			string searchText,
			int index = 0);

		Task<BaseResponseViewModel> AddQuestionAsync(
			QuestionRequestViewModel questionRequestViewModel);

		Task UpdateQuestionAsync(
			int questionId,
			QuestionRequestViewModel questionRequestViewModel);

		Task AddBountyAsync(int questionId, int points);

		Task DeleteQuestionAsync(int questionId);
	}
}