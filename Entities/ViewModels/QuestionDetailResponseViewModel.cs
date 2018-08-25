using System;
using System.Collections.Generic;
using QaNet.Contracts.Paging;

namespace QaNet.Entities.ViewModels
{
	public class QuestionDetailResponseViewModel : QuestionBaseViewModel
	{
		public string Question { get; set; }

		public int TotalBookmarks { get; set; }

		public bool SelfBookmarked { get; set; }

		public bool SelfVoted { get; set; }

		public int? SelfVote { get; set; }

		public IPaginate<CommentsViewModel> Comments { get; set; }

		// TODO : This is temporary fix. Need to think of something else.
		public bool ShouldSerializeComments()
		{
			return this.Comments != null;
		}

		public void ResetComments()
		{
			this.Comments = null;
		}

		public bool ShouldSerializeQuestion()
		{
			return this.Question != null;
		}

		public void ResetQuestion()
		{
			this.Question = null;
		}
	}
}