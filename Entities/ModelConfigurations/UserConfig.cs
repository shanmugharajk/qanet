using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class UserConfig : IEntityTypeConfiguration<User>
  {
    public void Configure(EntityTypeBuilder<User> builder)
    {
      builder.HasKey(e => e.UserId);

      builder.Property(e => e.Password).IsRequired();

      builder.Property(e => e.SerialNumber).HasMaxLength(450);
    }
  }
}