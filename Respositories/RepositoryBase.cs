using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using QaNet.Constants;
using QaNet.Contracts.Paging;
using QaNet.Contracts.Repository;
using QaNet.CustomExceptions;
using QaNet.Entities;

namespace QaNet.Respositories
{
	public abstract class RepositoryBase<T> : IRepository<T> where T : class
	{
		protected readonly QaContext QaContext;

		protected readonly DbSet<T> dbSet;

		public RepositoryBase(QaContext QaContext)
		{
			this.QaContext = QaContext;
			this.dbSet = QaContext.Set<T>();
		}

		public DbSet<T> GetEntity()
		{
			return this.dbSet;
		}

		public async Task<int> CountAsync(
			Expression<Func<T, bool>> predicate = null,
			bool disableTracking = true,
			CancellationToken cancellationToken = default(CancellationToken))
		{
			IQueryable<T> query = this.dbSet;
			if (disableTracking)
			{
				query = query.AsNoTracking();
			}

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			return await query.CountAsync(cancellationToken);
		}

		public async Task<T> FirstAsync(
				 Expression<Func<T, bool>> predicate = null,
				 Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				 Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				 bool disableTracking = true,
				 CancellationToken cancellationToken = default(CancellationToken))
		{
			var result = await this.FirstOrDefaultAsync(
				predicate, orderBy, include, disableTracking, cancellationToken
			);

			if (result == null)
			{
				throw new QaException(Messages.NoRecords);
			}

			return result;
		}

		public async Task<T> FirstOrDefaultAsync(
			Expression<Func<T, bool>> predicate = null,
			Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
			Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
			bool disableTracking = true,
			CancellationToken cancellationToken = default(CancellationToken))
		{
			IQueryable<T> query = this.dbSet;
			if (disableTracking)
			{
				query = query.AsNoTracking();
			}

			if (include != null)
			{
				query = include(query);
			}

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			if (orderBy != null)
			{
				return await orderBy(query).FirstOrDefaultAsync(cancellationToken);
			}
			else
			{
				return await query.FirstOrDefaultAsync(cancellationToken);
			}
		}

		public async Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate = null,
				Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				bool disableTracking = true,
				CancellationToken cancellationToken = default(CancellationToken))
		{
			IQueryable<T> query = this.dbSet;
			if (disableTracking)
			{
				query = query.AsNoTracking();
			}

			if (include != null)
			{
				query = include(query);
			}

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			if (orderBy != null)
			{
				return await orderBy(query).ToListAsync(cancellationToken);
			}
			else
			{
				return await query.ToListAsync(cancellationToken);
			}
		}

		public Task<IPaginate<T>> GetListAsync(Expression<Func<T, bool>> predicate = null,
				Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
				Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null,
				int index = 0,
				int size = 20,
				bool disableTracking = true,
				CancellationToken cancellationToken = default(CancellationToken))
		{
			IQueryable<T> query = this.dbSet;
			if (disableTracking)
			{
				query = query.AsNoTracking();
			}

			if (include != null)
			{
				query = include(query);
			}

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			if (orderBy != null)
			{
				return orderBy(query).ToPaginateAsync(index, size, cancellationToken);
			}
			else
			{
				return query.ToPaginateAsync(index, size, cancellationToken);
			}
		}

		public Task AddAsync(T entity)
		{
			return AddAsync(entity, new CancellationToken());
		}

		public Task AddAsync(T entity, CancellationToken cancellationToken = default(CancellationToken)) => this.dbSet.AddAsync(entity, cancellationToken);

		public Task AddAsync(params T[] entities) => this.dbSet.AddRangeAsync(entities);

		public Task AddAsync(IEnumerable<T> entities,
				CancellationToken cancellationToken = default(CancellationToken)) =>
				this.dbSet.AddRangeAsync(entities, cancellationToken);

		public void Update(T entity)
		{
			this.dbSet.Update(entity);
		}

		public void Update(params T[] entities)
		{
			this.dbSet.UpdateRange(entities);
		}


		public void Update(IEnumerable<T> entities)
		{
			this.dbSet.UpdateRange(entities);
		}

		public void Delete(T entity)
		{
			this.dbSet.Remove(entity);
		}

		public void DeleteById(object id)
		{
			var typeInfo = typeof(T).GetTypeInfo();
			var key = this.QaContext.Model.FindEntityType(typeInfo).FindPrimaryKey().Properties.FirstOrDefault();
			var property = typeInfo.GetProperty(key?.Name);
			if (property != null)
			{
				var entity = Activator.CreateInstance<T>();
				property.SetValue(entity, id);
				this.QaContext.Entry(entity).State = EntityState.Deleted;
			}
			else
			{
				var entity = this.dbSet.Find(id);
				if (entity != null) Delete(entity);
			}
		}

		public void Delete(params T[] entities)
		{
			this.dbSet.RemoveRange(entities);
		}

		public void Delete(IEnumerable<T> entities)
		{
			this.dbSet.RemoveRange(entities);
		}
	}
}