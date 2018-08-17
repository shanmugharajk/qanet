namespace QaNet.Entities.ViewModels
{
  public class BookmarkViewModel
  {
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string Title { get; set; }

    public int Votes { get; set; }

    public int NoOfAnswers { get; set; }

    public bool HasAcceptedAnswer { get; set; }
  }
}