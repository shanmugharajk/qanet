using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.ViewModels
{
  public class TagViewModel
  {
    [Required]
    public string Id { get; set; }

    [Required]
    public string Description { get; set; }
  }
}