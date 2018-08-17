using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
	public class Answer : BaseEntity
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string AnswerText { get; set; }

		public int Votes { get; set; }

		public bool? IsAccepted { get; set; }

		public int QuestionId { get; set; }

		public string Author { get; set; }

		public virtual List<AnswerComment> Comments { get; set; }

		public virtual Question Question { get; set; }

		public virtual User User { get; set; }

		public Answer()
		{
			this.Comments = new List<AnswerComment>();
		}
	}
}