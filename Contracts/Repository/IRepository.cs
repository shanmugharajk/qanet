using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using QaNet.Contracts.Paging;

namespace QaNet.Contracts.Repository
{
	public interface IRepository<T> where T : class
	{
		DbSet<T> GetEntity();

		Task<int> CountAsync(
					Expression<Func<T, bool>> predicate = null,
					bool disableTracking = true,
					CancellationToken cancellationToken = default(CancellationToken));

		Task<T> FirstAsync(
						 Expression<Func<T, bool>> predicate = null,
						 Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
						 Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
						 bool disableTracking = true,
						 CancellationToken cancellationToken = default(CancellationToken));
		Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate = null,
				 Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				 Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				 bool disableTracking = true,
				 CancellationToken cancellationToken = default(CancellationToken));

		Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate = null,
				Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				bool disableTracking = true,
				CancellationToken cancellationToken = default(CancellationToken));

		Task<IPaginate<T>> GetListAsync(Expression<Func<T, bool>> predicate = null,
				Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				int index = 0,
				int size = 20,
				bool disableTracking = true,
				CancellationToken cancellationToken = default(CancellationToken));

		Task AddAsync(T entity, CancellationToken cancellationToken = default(CancellationToken));

		Task AddAsync(params T[] entities);

		Task AddAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default(CancellationToken));

		void Delete(T entity);

		void DeleteById(object id);

		void Delete(params T[] entities);

		void Delete(IEnumerable<T> entities);

		void Update(T entity);

		void Update(params T[] entities);

		void Update(IEnumerable<T> entities);
	}
}