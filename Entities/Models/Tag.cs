using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
	public class Tag : BaseEntity
	{
		public string Id { get; set; }

		public string Description { get; set; }

		public string CreatedBy { get; set; }

		public string UpdatedBy { get; set; }

		public virtual User Creator { get; set; }

		public virtual User Updater { get; set; }

		public virtual ICollection<QuestionTag> QuestionTags { get; set; }
	}
}