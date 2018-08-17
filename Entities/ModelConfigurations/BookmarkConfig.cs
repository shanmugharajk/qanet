using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class BookmarkConfig : IEntityTypeConfiguration<Bookmark>
  {
    public void Configure(EntityTypeBuilder<Bookmark> builder)
    {
    }
  }
}