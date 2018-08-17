using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace QaNet.Contracts.Repository
{
  public interface IUnitOfWork : IDisposable
  {
    Task<int> SaveChangesAsync();
  }
}