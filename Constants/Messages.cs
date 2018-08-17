using System.Runtime.Serialization;

namespace QaNet.Constants
{
	public static class Messages
	{
		public const string NoRecords = "No Records found";

		public const string NoRightsToModifyQuestion = "You dont right's to update/delete the question";

		public const string NoRightsToModifyAnswer = "You dont right's to update/delete the answer";

		public const string CantDeleteSinceItHasUpVotes = "This question has upvotes, So can't be deleted since it may be useful to others.";

		public const string CantDeleteSinceItHasAnswer = "This question has answers, So can't be deleted since it may be useful to others.";

		public const string InvalidQuestionId = "Invalid question id sent";

		public const string InvalidCommentId = "Invalid question id sent";

		public const string InvalidAnswerId = "Invalid answer id sent";

		public const string NotEligibleForBounty = "To give bounty points user should have more than 50 points.";

		public const string InSufficientPoints = "You don't have that many points";

		public const string InvalidVote = "Invalid vote code sent";

		public const string CantVoteOwnPost = "Can't vote own post";

		public const string CantDownVote = "You dont have enough points to down vote.";

		public const string CantUpVote = "You dont have enough points to up vote.";

		public const string NoRightsToModifyComment = "You can't update others comments";

		public const string CantAcceptAnswerForOthersQuestion = "Can't accept answer for the questions which you didn't ask";
	}
}