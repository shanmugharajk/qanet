using System.Collections.Generic;

namespace QaNet.Contracts.Paging
{
  public interface IPaginate<T>
  {
    int Index { get; }

    int Size { get; }

    int Count { get; }

    int Pages { get; }

    IList<T> Items { get; }

    bool HasPrevious { get; }

    bool HasNext { get; }
  }
}