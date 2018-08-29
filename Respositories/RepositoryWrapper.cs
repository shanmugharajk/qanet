using AutoMapper;
using QaNet.Contracts.Repository;
using QaNet.Entities;

namespace QaNet.Respositories
{
	public class RepositoryWrapper : IRepositoryWrapper
	{
		private readonly QaContext qaContext;

		private readonly IMapper mapper;

		private IRolesRepository roles;

		private IUserTokenRepository userToken;

		private IUserRepository user;

		private ITagRepository tag;

		private IQuestionRepository question;

		private IAnswerRepository answer;

		private IQuestionVotersListRepository questionVotersList;

		private IQuestionTagRepository questionTag;

		private IQuestionCommentRepository questionComment;

		private IBookmarkRepository bookmark;

		private IAnswerVotersListRepository answerVotersList;

		private IAnswerCommentRepository answerComment;

		private IUserRoleRepository userRoles;

		public IAnswerCommentRepository AnswerComment
		{
			get
			{
				if (this.answerComment == null)
				{
					this.answerComment = new AnswerCommentRepository(this.qaContext);
				}

				return this.answerComment;
			}
		}

		public IAnswerVotersListRepository AnswerVotersList
		{
			get
			{
				if (this.answerVotersList == null)
				{
					this.answerVotersList = new AnswerVotersListRepository(this.qaContext);
				}

				return this.answerVotersList;
			}
		}

		public IBookmarkRepository Bookmark
		{
			get
			{
				if (this.bookmark == null)
				{
					this.bookmark = new BookmarkRepository(this.qaContext);
				}

				return this.bookmark;
			}
		}

		public IQuestionCommentRepository QuestionComment
		{
			get
			{
				if (this.questionComment == null)
				{
					this.questionComment = new QuestionCommentRepository(this.qaContext);
				}

				return this.questionComment;
			}
		}

		public IQuestionVotersListRepository QuestionVotersList
		{
			get
			{
				if (this.questionVotersList == null)
				{
					this.questionVotersList = new QuestionVotersListRepository(this.qaContext);
				}

				return this.questionVotersList;
			}
		}

		public IAnswerRepository Answer
		{
			get
			{
				if (this.answer == null)
				{
					this.answer = new AnswerRepository(this.qaContext);
				}

				return this.answer;
			}
		}
		public IQuestionTagRepository QuestionTag
		{
			get
			{
				if (this.questionTag == null)
				{
					this.questionTag = new QuestionTagRepository(this.qaContext);
				}

				return this.questionTag;
			}
		}

		public IQuestionRepository Question
		{
			get
			{
				if (this.question == null)
				{
					this.question = new QuestionRepository(this.mapper, this.qaContext);
				}

				return this.question;
			}
		}

		public ITagRepository Tag
		{
			get
			{
				if (this.tag == null)
				{
					this.tag = new TagRepository(this.qaContext);
				}

				return this.tag;
			}
		}

		public IUserRepository User
		{
			get
			{
				if (this.user == null)
				{
					this.user = new UserRepository(this.qaContext);
				}

				return this.user;
			}
		}

		public IUserTokenRepository UserToken
		{
			get
			{
				if (this.userToken == null)
				{
					this.userToken = new UserTokenRepository(this.qaContext);
				}

				return this.userToken;
			}
		}

		public IRolesRepository Roles
		{
			get
			{
				if (this.roles == null)
				{
					this.roles = new RolesRepository(this.qaContext);
				}

				return this.roles;
			}
		}
		public IUserRoleRepository UserRole
		{
			get
			{
				if (this.userRoles == null)
				{
					this.userRoles = new UserRoleRepository(this.qaContext);
				}

				return this.userRoles;
			}
		}

		public RepositoryWrapper(IMapper mapper, QaContext dbContext)
		{
			this.qaContext = dbContext;
			this.mapper = mapper;
		}
	}
}