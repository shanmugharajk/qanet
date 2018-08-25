namespace QaNet.Entities.ViewModels
{
	public class PostsViewModel
	{
		public int Id { get; set; }

		public string Title { get; set; }

		// div id of answer to navigate to get focus on the answer.
		// Usually answerid here.
		// TODO think of a better name.
		public string FragmentToNavigate { get; set; }

		public int Votes { get; set; }

		public bool? HasAcceptedAnswer { get; set; }

		public int AnswersCount { get; set; }
	}
}