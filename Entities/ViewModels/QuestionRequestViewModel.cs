using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.ViewModels
{
  public class QuestionRequestViewModel
  {
    [Required]
    public string Title { get; set; }

    [Required]
    public string ShortDescription { get; set; }

    [Required]
    public List<string> Tags { get; set; }

    [Required]
    public string Question { get; set; }
  }
}