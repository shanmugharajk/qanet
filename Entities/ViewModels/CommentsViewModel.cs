using System;

namespace QaNet.Entities.ViewModels
{
	public class CommentsViewModel
	{
		public int Id { get; set; }

		public string Comment { get; set; }

		public string Author { get; set; }

		public DateTime CommentedAt { get; set; }
	}
}