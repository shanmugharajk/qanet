using Microsoft.EntityFrameworkCore;
using QaNet.Entities.ModelConfigurations;

namespace QaNet.Extensions
{
  public static class ModelBuilderExtensions
  {
    public static void ConfigureModels(this ModelBuilder builder)
    {
      builder.ApplyConfiguration(new UserConfig());
      builder.ApplyConfiguration(new RoleConfig());
      builder.ApplyConfiguration(new UserRoleConfig());
      builder.ApplyConfiguration(new UserTokenConfig());
      builder.ApplyConfiguration(new TagConfig());
      builder.ApplyConfiguration(new QuestionConfig());
      builder.ApplyConfiguration(new QuestionTagConfig());
      builder.ApplyConfiguration(new QuestionCommentConfig());
      builder.ApplyConfiguration(new QuestionVotersListConfig());
      builder.ApplyConfiguration(new BookmarkConfig());
      builder.ApplyConfiguration(new AnswerConfig());
      builder.ApplyConfiguration(new AnswerCommentConfig());
      builder.ApplyConfiguration(new AnswerVotersListConfig());
    }
  }
}