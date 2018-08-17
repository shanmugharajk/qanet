using System;
using System.Collections.Generic;
using System.Linq;
using QaNet.Contracts.Paging;

namespace QaNet.Respositories
{
	public class Paginate<T> : IPaginate<T>
	{
		public int Index { get; set; }

		public int Size { get; set; }

		public int Count { get; set; }

		public int Pages { get; set; }

		public IList<T> Items { get; set; }

		public bool HasPrevious
		{
			get
			{
				if (this.Count > 0)
				{
					return Index - 1 > 0;
				}
				return false;
			}
		}

		public bool HasNext
		{
			get
			{
				if (this.Count > 0)
				{
					return Index < Pages;
				}
				return false;
			}
		}

		internal Paginate(IEnumerable<T> source, int index, int size)
		{
			var enumerable = source as T[] ?? source.ToArray();

			if (source is IQueryable<T> querable)
			{
				this.Index = index;
				this.Size = size;
				this.Count = querable.Count();
				this.Pages = (int)Math.Ceiling(Count / (double)Size);

				this.Items = querable.Skip(Index * Size).Take(Size).ToList();
			}
			else
			{
				this.Index = index;
				this.Size = size;

				this.Count = enumerable.Count();
				this.Pages = (int)Math.Ceiling(Count / (double)Size);

				this.Items = enumerable.Skip(Index * Size).Take(Size).ToList();
			}
		}

		internal Paginate() => this.Items = new T[0];
	}


	internal class Paginate<TSource, TResult> : IPaginate<TResult>
	{

		public int Index { get; }

		public int Size { get; }

		public int Count { get; }

		public int Pages { get; }

		public IList<TResult> Items { get; }

		public bool HasPrevious => Index > 0;

		public bool HasNext => Index + 1 < Pages;

		public Paginate(IEnumerable<TSource> source, Func<IEnumerable<TSource>, IEnumerable<TResult>> converter, int index, int size)
		{
			var enumerable = source as TSource[] ?? source.ToArray();

			if (source is IQueryable<TSource> queryable)
			{
				this.Index = index;
				this.Size = size;
				this.Count = queryable.Count();
				this.Pages = (int)Math.Ceiling(Count / (double)Size);

				var items = queryable.Skip(Index * Size).Take(Size).ToArray();

				this.Items = new List<TResult>(converter(items));
			}
			else
			{
				this.Index = index;
				this.Size = size;
				this.Count = enumerable.Count();
				this.Pages = (int)Math.Ceiling(Count / (double)Size);

				var items = enumerable.Skip(Index * Size).Take(Size).ToArray();

				this.Items = new List<TResult>(converter(items));
			}
		}


		public Paginate(IPaginate<TSource> source, Func<IEnumerable<TSource>, IEnumerable<TResult>> converter)
		{
			this.Index = source.Index;
			this.Size = source.Size;
			this.Count = source.Count;
			this.Pages = source.Pages;

			this.Items = new List<TResult>(converter(source.Items));
		}
	}

	public static class Paginate
	{

		public static IPaginate<T> Empty<T>() => new Paginate<T>();

		public static IPaginate<TResult> From<TResult, TSource>(IPaginate<TSource> source, Func<IEnumerable<TSource>, IEnumerable<TResult>> converter) => new Paginate<TSource, TResult>(source, converter);
	}
}