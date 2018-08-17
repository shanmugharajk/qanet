using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;

namespace QaNet.Respositories
{
  public class TagRepository : RepositoryBase<Tag>, ITagRepository
  {
    public TagRepository(QaContext qaContext)
    : base(qaContext)
    {
    }
  }
}