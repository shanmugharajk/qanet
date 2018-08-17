using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class QuestionConfig : IEntityTypeConfiguration<Question>
  {
    public void Configure(EntityTypeBuilder<Question> builder)
    {
      builder.HasKey(o => o.Id);

      builder.HasOne(o => o.User)
        .WithMany()
        .HasForeignKey(p => p.Author);

      builder.Property(o => o.Title).IsRequired();

      builder.Property(o => o.QuestionText).IsRequired();

      builder.Property(o => o.Votes).HasDefaultValue(0);

      builder.Property(o => o.CloseVotes).HasDefaultValue(0);

      builder.Property(o => o.IsActive).HasDefaultValue(true);

      builder.Property(o => o.IsClosed).HasDefaultValue(false);

      builder.Property(o => o.Votes).HasDefaultValue(0);
    }
  }
}