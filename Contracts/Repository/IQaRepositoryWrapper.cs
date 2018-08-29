namespace QaNet.Contracts.Repository
{
	public interface IRepositoryWrapper
	{
		IRolesRepository Roles { get; }

		IUserRoleRepository UserRole { get; }

		IUserTokenRepository UserToken { get; }

		IUserRepository User { get; }

		ITagRepository Tag { get; }

		IQuestionRepository Question { get; }

		IQuestionTagRepository QuestionTag { get; }

		IAnswerRepository Answer { get; }

		IQuestionVotersListRepository QuestionVotersList { get; }

		IQuestionCommentRepository QuestionComment { get; }

		IAnswerCommentRepository AnswerComment { get; }

		IBookmarkRepository Bookmark { get; }

		IAnswerVotersListRepository AnswerVotersList { get; }
	}
}