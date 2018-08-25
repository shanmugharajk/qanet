using System.Collections.Generic;
using QaNet.Contracts.Paging;

namespace QaNet.Entities.ViewModels
{
	public class PaginationViewModelBase<T> : IPaginate<T>
	{
		public int Index { get; set; }

		public int Size { get; set; }

		public int Count { get; set; }

		public int Pages { get; set; }

		public bool HasPrevious { get; set; }

		public bool HasNext { get; set; }

		public IList<T> Items { get; set; }
	}
}