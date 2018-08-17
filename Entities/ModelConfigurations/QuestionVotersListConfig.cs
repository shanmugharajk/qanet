using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class QuestionVotersListConfig : IEntityTypeConfiguration<QuestionVotersList>
  {
    public void Configure(EntityTypeBuilder<QuestionVotersList> builder)
    {
      builder.HasKey(qvl => new { qvl.QuestionId, qvl.VoterId });

      builder.HasOne(qvl => qvl.User)
        .WithMany()
        .HasForeignKey(qvl => qvl.VoterId);

      builder.HasOne(qvl => qvl.Question)
        .WithMany()
        .HasForeignKey(qvl => qvl.QuestionId);
    }
  }
}