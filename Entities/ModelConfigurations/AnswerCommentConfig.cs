using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class AnswerCommentConfig : IEntityTypeConfiguration<AnswerComment>
  {
    public void Configure(EntityTypeBuilder<AnswerComment> builder)
    {
      builder.Property(o => o.Comment).IsRequired();

      builder.HasOne(o => o.Answer)
        .WithMany(o => o.Comments);

      builder.HasOne(o => o.User)
        .WithMany()
        .HasForeignKey(p => p.Author);
    }
  }
}