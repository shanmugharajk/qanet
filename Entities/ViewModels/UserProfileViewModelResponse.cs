using System;

namespace QaNet.Entities.ViewModels
{
	public class UserProfileViewModelResponse
	{
		public string UserId { get; set; }

		public string DisplayName { get; set; }

		public int Points { get; set; }

		public string About { get; set; }

		public DateTime JoinedAt { get; set; }
	}
}