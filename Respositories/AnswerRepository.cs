using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class AnswerRepository : RepositoryBase<Answer>, IAnswerRepository
	{
		public AnswerRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task<bool> HasAcceptedAnswerAsync(int questionId) =>
			await this.CountAsync(x => x.QuestionId == questionId && x.IsAccepted == true) > 0;

		public async Task<int> TotalAnswersAsync(int questionId) =>
			await this.CountAsync(x => x.QuestionId == questionId);
	}
}