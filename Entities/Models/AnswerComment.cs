using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
  public class AnswerComment : BaseEntity
  {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Comment { get; set; }

    public string Author { get; set; }

    public int AnswerId { get; set; }

    public Answer Answer { get; set; }

    public User User { get; set; }
  }
}