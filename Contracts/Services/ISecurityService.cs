namespace QaNet.Contracts.Services
{
  public interface ISecurityService
  {
    string GetSha256Hash(string input);
  }
}