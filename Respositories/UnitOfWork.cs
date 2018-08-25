using System.Threading.Tasks;
using QaNet.Contracts.Repository;
using QaNet.Entities;

namespace QaNet.Respositories
{
	public class UnitOfWork : IUnitOfWork
	{
		private readonly QaContext QaContext;

		public UnitOfWork(QaContext QaContext)
		{
			this.QaContext = QaContext;
		}

		public void Dispose()
		{
			this.QaContext?.Dispose();
		}

		public async Task<int> SaveChangesAsync()
		{
			return await this.QaContext?.SaveChangesAsync();
		}
	}
}