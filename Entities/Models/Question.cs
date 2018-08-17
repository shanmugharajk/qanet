using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
	public class Question : BaseEntity
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		public string Title { get; set; }

		public string QuestionText { get; set; }

		public string ShortDescription { get; set; }

		public int Votes { get; set; }

		public int CloseVotes { get; set; }

		public int? BountyPoints { get; set; }

		public DateTime? BountyExpiryDate { get; set; }

		public bool? IsActive { get; set; }

		public bool? IsClosed { get; set; }

		public bool? IsReOpenRequested { get; set; }

		public string Author { get; set; }

		public virtual List<QuestionComment> Comments { get; set; }

		public virtual User User { get; set; }

		public virtual ICollection<QuestionTag> QuestionTags { get; set; }

	}
}