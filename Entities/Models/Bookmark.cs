using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
  public class Bookmark : BaseEntity
  {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string UserId { get; set; }

    public int QuestionId { get; set; }

    public virtual Question Question { get; set; }

    public virtual User User { get; set; }
  }
}