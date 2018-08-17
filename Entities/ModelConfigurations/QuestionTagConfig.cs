using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QaNet.Entities.Models;

namespace QaNet.Entities.ModelConfigurations
{
	public class QuestionTagConfig : IEntityTypeConfiguration<QuestionTag>
	{
		public void Configure(EntityTypeBuilder<QuestionTag> builder)
		{
			builder.HasKey(qt => new { qt.TagId, qt.QuestionId });

			builder
				.HasOne<Question>(qt => qt.Question)
				.WithMany(qt => qt.QuestionTags)
				.HasForeignKey(qt => qt.QuestionId)
				.OnDelete(DeleteBehavior.Cascade);

			builder
				.HasOne<Tag>(qt => qt.Tag)
				.WithMany(qt => qt.QuestionTags)
				.HasForeignKey(qt => qt.TagId);
		}
	}
}