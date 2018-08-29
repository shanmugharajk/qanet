using Microsoft.EntityFrameworkCore;
using QaNet.Entities.ModelConfigurations;
using QaNet.Entities.Models;
using QaNet.Extensions;

namespace QaNet.Entities
{
  public class QaContext : DbContext
  {
    public QaContext(DbContextOptions options)
    : base(options)
    {
    }

    public virtual DbSet<User> Users { set; get; }

    public virtual DbSet<Role> Roles { set; get; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<UserToken> UserTokens { get; set; }

    public virtual DbSet<Question> Questions { get; set; }
    
		public virtual DbSet<QuestionsSearch> QuestionsSearch { get; set; }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<QuestionComment> QuestionComments { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<QuestionVotersList> QuestionVotersList { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.ConfigureModels();
    }
  }
}