using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.ViewModels
{
  public class LoginViewModel
  {
    [Required]
    public string UserId { get; set; }

    [Required]
    public string Password { get; set; }
  }
}