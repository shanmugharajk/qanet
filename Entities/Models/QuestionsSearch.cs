using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.Models
{
    public class QuestionsSearch
    {
				[Key]
        public string QuestionId { get; set; }

				public string Title { get; set; }
    }
}