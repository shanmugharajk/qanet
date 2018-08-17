using System;
using System.Collections.Generic;

namespace QaNet.Entities.ViewModels
{
	public class QuestionBaseViewModel
	{
		public int Id { get; set; }

		public string Title { get; set; }

		public List<string> Tags { get; set; }

		public int TotalAnswers { get; set; }

		public bool HasAcceptedAnswer { get; set; }

		public int Votes { get; set; }

		public DateTime? BountyExpiry { get; set; }

		public bool OwnQuestion { get; set; }

		public string Author { get; set; }

		public int AuthorPoints { get; set; }

		public int? BountyPoints { get; set; }

		public DateTime CreatedAt { get; set; }

		public DateTime UpdatedAt { get; set; }
	}
}