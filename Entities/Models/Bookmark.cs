using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
  public class Bookmark : BaseEntity
  {
    public string UserId { get; set; }

    public int QuestionId { get; set; }

    public virtual Question Question { get; set; }

    public virtual User User { get; set; }
  }
}