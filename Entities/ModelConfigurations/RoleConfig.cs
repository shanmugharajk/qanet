using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class RoleConfig : IEntityTypeConfiguration<Role>
  {
    public void Configure(EntityTypeBuilder<Role> builder)
    {
      builder.Property(e => e.Name).HasMaxLength(450).IsRequired();

      builder.HasIndex(e => e.Name).IsUnique();
    }
  }
}