using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using QaNet.Contracts.Paging;
using QaNet.Contracts.Repository;
using QaNet.Entities;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Respositories
{
	public class QuestionRepository : RepositoryBase<Question>, IQuestionRepository
	{
		private readonly DbSet<Answer> answers;

		private readonly IMapper mapper;

		public QuestionRepository(IMapper mapper, QaContext qaContext)
		: base(qaContext)
		{
			this.answers = qaContext.Set<Answer>();
			this.answers.CheckArgumentIsNull(nameof(QuestionRepository.answers));

			this.mapper = mapper;
			this.mapper.CheckArgumentIsNull(nameof(QuestionRepository.mapper));
		}

		public async Task<int> GetVotesAsync(int questionId) =>
			 await this.CountAsync(x => x.Id == questionId && x.Votes > 0);

		public async Task<bool> HasRightsToModifyAsync(string userId) =>
			(await this.CountAsync(x => x.Author == userId)) > 0;


		public async Task<bool> HasAcceptedAnswerAsync(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return await query.CountAsync() > 0;
		}

		public async Task<int> GetAnswersCountAsync(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return await query.CountAsync();
		}

		public bool HasAcceptedAnswer(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return query.Count() > 0;
		}

		public int GetAnswersCount(int questionId)
		{
			IQueryable<Answer> query = this.answers
				.Where(o => o.IsAccepted == true && o.QuestionId == questionId);

			return query.Count();
		}

		public async Task InsertIntoSearchTableAsync(int questionId, string title)
		{
			var commandText = "INSERT INTO QuestionsSearch (Title, QuestionId) VALUES (@Title, @QuestionId)";

			var questionIdParam = new SqliteParameter("@Title", title);
			var titleParam = new SqliteParameter("@QuestionId", questionId.ToString());

			await this.QaContext.Database.ExecuteSqlCommandAsync(commandText, questionIdParam, titleParam);
		}

		public async Task UpdateSearchTableAsync(int questionId, string title)
		{
			var commandText = @"UPDATE QuestionsSearch 
				SET Title = @Title 
				WHERE QuestionId MATCH @QuestionId";

			var questionIdParam = new SqliteParameter("@Title", title);
			var titleParam = new SqliteParameter("@QuestionId", questionId.ToString());

			await this.QaContext.Database.ExecuteSqlCommandAsync(commandText, questionIdParam, titleParam);
		}

		// SELECT * FROM docs WHERE docs MATCH 'linux';
		public async Task<IPaginate<QuestionsSearch>> SearchQuestion(
			string searchText,
			int index,
			int size = 10)
		{
			// https://stackoverflow.com/questions/16370014/sqlite-joining-results
			// SELECT COUNT(*) FROM QuestionsSearch WHERE QuestionsSearch MATCH 8 LIMIT 1 OFFSET 0
			// https://www.sqlite.org/fts3.html Examples
			// TODO Form a proper full text query.
			var searchParam = new SqliteParameter("@SearchText", $"{searchText}*");
			var sizeParam = new SqliteParameter("@Size", size);
			var offsetParam = new SqliteParameter("@Offset", index);

			var fetchQuery = @"SELECT * FROM QuestionsSearch 
							WHERE QuestionsSearch MATCH @SearchText";

			var searchResult = await this.QaContext.QuestionsSearch
				.FromSql(fetchQuery, searchParam)
				.ToPaginateAsync(index, size);

			return searchResult;
		}
	}
}