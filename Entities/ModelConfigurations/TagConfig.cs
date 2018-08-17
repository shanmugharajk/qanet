using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class TagConfig : IEntityTypeConfiguration<Tag>
  {
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
      builder.HasKey(o => o.Id);

      builder.Property(o => o.Description).IsRequired();

      builder.HasOne(o => o.Creator)
        .WithMany()
        .HasForeignKey(o => o.CreatedBy);

      builder.HasOne(o => o.Updater)
        .WithMany()
        .HasForeignKey(o => o.UpdatedBy);
    }
  }
}