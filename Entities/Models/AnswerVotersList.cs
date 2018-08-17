namespace QaNet.Entities.Models
{
  public class AnswerVotersList : BaseEntity
  {
    public string VoterId { get; set; }

    public int AnswerId { get; set; }

    public int Vote { get; set; }

    public User User { get; set; }

    public Answer Answer { get; set; }
  }
}