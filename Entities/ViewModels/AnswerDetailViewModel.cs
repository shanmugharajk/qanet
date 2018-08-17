using System;
using QaNet.Contracts.Paging;

namespace QaNet.Entities.ViewModels
{
	public class AnswerDetailViewModel
	{
		public int Id { get; set; }

		public string Answer { get; set; }

		public IPaginate<CommentsViewModel> Comments { get; set; }

		public int? Votes { get; set; }

		public string Author { get; set; }

		public int AuthorPoints { get; set; }

		public DateTime CreatedAt { get; set; }

		public DateTime UpdatedAt { get; set; }

		public bool? IsAccepted { get; set; }

		public bool SelfVoted { get; set; }

		public int? SelfVote { get; set; }
	}
}