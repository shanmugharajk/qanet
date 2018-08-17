using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
  public class AnswerVotersListConfig : IEntityTypeConfiguration<AnswerVotersList>
  {
    public void Configure(EntityTypeBuilder<AnswerVotersList> builder)
    {
      builder.HasKey(qvl => new { qvl.AnswerId, qvl.VoterId });

      builder.HasOne(qvl => qvl.User)
        .WithMany()
        .HasForeignKey(qvl => qvl.VoterId);

      builder.HasOne(qvl => qvl.Answer)
        .WithMany()
        .HasForeignKey(qvl => qvl.AnswerId);
    }
  }
}