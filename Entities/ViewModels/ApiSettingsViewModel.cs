namespace QaNet.Entities.ViewModels
{
  public class ApiSettingsViewModel
  {
    public string LoginPath { get; set; }

    public string LogoutPath { get; set; }

    public string RefreshTokenPath { get; set; }

    public string AccessTokenObjectKey { get; set; }

    public string RefreshTokenObjectKey { get; set; }

    public string AdminRoleName { get; set; }
  }
}