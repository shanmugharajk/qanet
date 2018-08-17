namespace QaNet.Entities.Domain
{
  public class CustomRoles
  {
    public const string Admin = nameof(Admin);

    public const string User = nameof(User);

    public const string AllUsers = nameof(Admin) + ", " + nameof(User);
  }
}