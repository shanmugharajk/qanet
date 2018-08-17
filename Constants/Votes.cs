using System.Collections.Generic;

namespace QaNet.Constants
{
  public static class Votes
  {
    public const int UpVote = 1;

    public const int DownVote = 2;

    public const int Zero = 0;

    public static List<int> ValidVotes =
      new List<int> { UpVote, DownVote, Zero };
  }
}