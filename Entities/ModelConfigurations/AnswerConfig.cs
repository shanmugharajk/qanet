using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
	public class AnswerConfig : IEntityTypeConfiguration<Answer>
	{
		public void Configure(EntityTypeBuilder<Answer> builder)
		{
			builder.Property(o => o.Votes).HasDefaultValue(0);

			builder.Property(o => o.AnswerText).IsRequired();

			builder.Property(o => o.Votes).HasDefaultValue(0);

			builder.Property(o => o.IsAccepted).HasDefaultValue(false);

			builder.HasOne(o => o.User)
				.WithMany()
				.HasForeignKey(p => p.Author);
		}
	}
}