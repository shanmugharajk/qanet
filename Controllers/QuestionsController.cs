using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QaNet.Constants;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Domain;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Controllers
{
	[Route("api/[controller]")]
	[Authorize(Roles = CustomRoles.AllUsers)]
	public class QuestionsController : Controller
	{
		private IAnswersService answersService;

		private IQuestionsService questionsService;

		private IQuestionCommentService questionCommentService;

		private IQuestionVotingService questionVotingService;

		public QuestionsController(
			IAnswersService answersService,
			IQuestionsService questionsService,
			IQuestionCommentService questionCommentService,
			IQuestionVotingService questionVotingService)
		{
			this.questionsService = questionsService;
			this.questionsService.CheckArgumentIsNull(nameof(QuestionsController.questionsService));

			this.questionCommentService = questionCommentService;
			this.questionCommentService.CheckArgumentIsNull(nameof(QuestionsController.questionCommentService));

			this.questionVotingService = questionVotingService;
			this.questionVotingService.CheckArgumentIsNull(nameof(QuestionsController.questionVotingService));

			this.answersService = answersService;
			this.answersService.CheckArgumentIsNull(nameof(QuestionsController.answersService));
		}

		// QUESTION ============
		[AllowAnonymous]
		[HttpGet()]
		public async Task<IActionResult> GetQuestions([FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var questionsList = await this.questionsService.FetchQuestionListAsync(index);
			return Ok(questionsList);
		}

		[AllowAnonymous]
		[HttpGet("search")]
		public async Task<IActionResult> SearchQuestions(
			[FromQuery(Name = "q")] string searchText,
			[FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var result = await this.questionsService.SearchQuestions(searchText, index);
			return Ok(result);
		}

		[AllowAnonymous]
		[HttpGet("{questionId}")]
		public async Task<IActionResult> GetQuestion(int questionId)
		{
			var question = await this.questionsService.FetchQuestionAsync(questionId);
			return Ok(question);
		}


		[HttpPost()]
		public async Task<IActionResult> AddQuestion([FromBody]QuestionRequestViewModel qvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			var newQuestionId = await this.questionsService.AddQuestionAsync(qvm);
			return Ok(newQuestionId);
		}

		[HttpPut("{questionId}")]
		public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody]QuestionRequestViewModel qvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.questionsService.UpdateQuestionAsync(questionId, qvm);
			return NoContent();
		}

		[HttpDelete("{questionId}")]
		public async Task<IActionResult> DeleteQuestion(int questionId)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.questionsService.DeleteQuestionAsync(questionId);
			return NoContent();
		}

		// QUESTION VOTE ============
		[HttpPost("{questionId}/vote/{vote}")]
		public async Task<IActionResult> SaveVote(int questionId, int vote)
		{
			var newVote = await this.questionVotingService.SaveVoteAsync(questionId, vote);
			return Ok(newVote);
		}

		// QUESTION COMMENT ==========
		[AllowAnonymous]
		[HttpGet("{questionId}/comments")]
		public async Task<IActionResult> GetQuestionComments(int questionId, [FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var comments = await this.questionCommentService.FetchComments(questionId, index);
			return Ok(comments);
		}

		[AllowAnonymous]
		[HttpGet("{questionId}/comments/all")]
		public async Task<IActionResult> GetAllQuestionComments(int questionId)
		{
			var comments = await this.questionCommentService.FetchAllComments(questionId);
			return Ok(comments);
		}

		[HttpPost("{questionId}/comments")]
		public async Task<IActionResult> AddComment(int questionId, [FromBody]CommentsRequestViewModel qcvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			var response = await this.questionCommentService.AddCommentAsync(questionId, qcvm.Comment);
			return Ok(response);
		}

		[HttpPut("{questionId}/comments/{commentId}")]
		public async Task<IActionResult> UpdateComment(
			int questionId,
			int commentId,
			[FromBody]CommentsRequestViewModel qcvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.questionCommentService.UpdateCommentAsync(commentId, questionId, qcvm.Comment);
			return NoContent();
		}

		[HttpDelete("{questionId}/comments/{commentId}")]
		public async Task<IActionResult> DeleteComment(int questionId, int commentId)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.questionCommentService.DeleteCommentAsync(commentId, questionId);
			return NoContent();
		}

		// ANSWERS ========
		[AllowAnonymous]
		[HttpGet("{questionId}/answers")]
		public async Task<IActionResult> FetchAnswers(int questionId, [FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var result = await this.answersService.FetchAnswers(questionId, index);
			return Ok(result);
		}

		[AllowAnonymous]
		[HttpGet("{questionId}/answers/{answerId}")]
		public async Task<IActionResult> FetchAnswerById(
			int questionId,
			int answerId,
			[FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var result = await this.answersService.FetchAnswer(questionId, answerId);
			return Ok(result);
		}

		[HttpPost("{questionId}/answers")]
		public async Task<IActionResult> AddAnswer(
					int questionId,
					[FromBody]PostAnswerRequestViewModel avm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			var result = await this.answersService.AddAnswerAsync(questionId, avm.Answer);
			return Ok(result);
		}


		[HttpPut("{questionId}/answers/{answerId}")]
		public async Task<IActionResult> UpdateAnswer(
			int questionId,
			int answerId,
			[FromBody]PostAnswerRequestViewModel avm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.answersService.UpdateAnswerAsync(questionId, answerId, avm.Answer);
			return NoContent();
		}

		[HttpDelete("{questionId}/answers/{answerId}")]
		public async Task<IActionResult> DeleteAnswer(
			int questionId,
			int answerId
		)
		{
			await this.answersService.DeleteAnswerAsync(questionId, answerId);
			return NoContent();
		}

		[HttpPost("{questionId}/answers/{answerId}/accept")]
		public async Task<IActionResult> AcceptAnswer(int questionId, int answerId)
		{
			await this.answersService.AcceptAnswerAsync(questionId, answerId);
			return NoContent();
		}
	}
}