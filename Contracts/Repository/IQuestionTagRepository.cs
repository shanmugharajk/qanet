using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Entities.Models;

namespace QaNet.Contracts.Repository
{
  public interface IQuestionTagRepository : IRepository<QuestionTag>
  {
    Task AddTagsToAQuestion(List<string> tags, int questionId);

    Task DeleteAllRelatedToAQuestion(int questionId);
  }
}