using System.ComponentModel.DataAnnotations;

namespace QaNet.Entities.ViewModels
{
	public class CommentsRequestViewModel
	{
		[Required]
		[MinLength(15)]
		[MaxLength(250)]
		public string Comment { get; set; }
	}
}