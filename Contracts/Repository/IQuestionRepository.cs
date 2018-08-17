using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
  public interface IQuestionRepository : IRepository<Question>
  {
    Task<int> GetVotesAsync(int questionId);

    Task<bool> HasRightsToModifyAsync(string userId);

    Task<int> GetAnswersCountAsync(int questionId);

    Task<bool> HasAcceptedAnswerAsync(int questionId);

    int GetAnswersCount(int questionId);

    bool HasAcceptedAnswer(int questionId);
  }
}