using System.Collections.Generic;

namespace QaNet.Entities.ViewModels
{
	public class QuestionsListResponseViewModel
	{
		public int Index { get; set; }

		public int Size { get; set; }

		public int Count { get; set; }

		public int Pages { get; set; }

		public bool HasPrevious { get; set; }

		public bool HasNext { get; set; }

		public List<QuestionBaseViewModel> Items { get; set; }
	}
}