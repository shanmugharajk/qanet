using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
  public class QuestionComment : BaseEntity
  {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Comment { get; set; }

    public string Author { get; set; }

    public int QuestionId { get; set; }

    public virtual Question Question { get; set; }

    public virtual User User { get; set; }
  }
}