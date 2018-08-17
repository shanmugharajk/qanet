namespace QaNet.Entities.Models
{
  public class QuestionVotersList : BaseEntity
  {
    public string VoterId { get; set; }

    public int QuestionId { get; set; }

    public int Vote { get; set; }

    public User User { get; set; }

    public Question Question { get; set; }
  }
}