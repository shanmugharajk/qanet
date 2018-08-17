using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
	public class QuestionCommentConfig : IEntityTypeConfiguration<QuestionComment>
	{
		public void Configure(EntityTypeBuilder<QuestionComment> builder)
		{
			builder.Property(o => o.Comment).IsRequired();

			builder.HasOne(o => o.User)
				.WithMany()
				.HasForeignKey(p => p.Author);
		}
	}
}