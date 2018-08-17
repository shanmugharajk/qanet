using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.ViewModels
{
	public class PostAnswerRequestViewModel
	{
		[Required]
		[MinLength(10)]
		public string Answer { get; set; }
	}
}