using System;

namespace QaNet.CustomExceptions
{
  public class QaException : Exception
  {
    public QaException()
    : base("Internal error has occurred, please try after sometime.")
    {
    }

    public QaException(string message)
    : base(message)
    {
    }
  }
}