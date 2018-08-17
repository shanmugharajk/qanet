using System.Collections.Generic;
using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
	public class QuestionTagRepository : RepositoryBase<QuestionTag>, IQuestionTagRepository
	{
		public QuestionTagRepository(QaContext qaContext)
		: base(qaContext)
		{
		}

		public async Task AddTagsToAQuestion(List<string> tags, int questionId)
		{
			foreach (var tag in tags)
			{
				var questionTag = new QuestionTag();
				questionTag.TagId = tag;
				questionTag.QuestionId = questionId;

				await this.AddAsync(questionTag);
			}
		}

		public async Task DeleteAllRelatedToAQuestion(int questionId)
		{
			var questionTagsToDelete = await this.GetAsync(x => x.QuestionId == questionId);
			this.Delete(questionTagsToDelete);
		}
	}
}