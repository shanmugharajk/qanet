using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QaNet.Respositories;

namespace QaNet.Contracts.Paging
{
	public static class IQueryablePaginateExtensions
	{
		public static async Task<IPaginate<T>> ToPaginateAsync<T>(this IQueryable<T> source, int index, int size, CancellationToken cancellationToken = default(CancellationToken))
		{
			var count = await source.CountAsync(cancellationToken).ConfigureAwait(false);
			var items = await source.Skip(index * size)
					.Take(size).ToListAsync(cancellationToken).ConfigureAwait(false);

			var list = new Paginate<T>()
			{
				Index = index + 1,
				Size = size,
				Count = count,
				Items = items,
				Pages = (int)Math.Ceiling(count / (double)size)
			};

			return list;
		}
	}
}