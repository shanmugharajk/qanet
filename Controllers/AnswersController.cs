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
	public class AnswersController : Controller
	{
		private IAnswersService answersService;

		private IAnswerCommentService answerCommentService;

		private IAnswerVotingService answerVotingService;

		public AnswersController(
			IAnswersService answersService,
			IAnswerCommentService answerCommentService,
			IAnswerVotingService questionVotingService)
		{
			this.answersService = answersService;
			this.answersService.CheckArgumentIsNull(nameof(AnswersController.answersService));

			this.answerCommentService = answerCommentService;
			this.answerCommentService.CheckArgumentIsNull(nameof(AnswersController.answerCommentService));

			this.answerVotingService = questionVotingService;
			this.answerVotingService.CheckArgumentIsNull(nameof(AnswersController.answerVotingService));
		}

		// ANSWER VOTE ============
		[HttpPost("{answerId}/vote/{vote}")]
		public async Task<IActionResult> SaveVote(int answerId, int vote)
		{
			var newVote = await this.answerVotingService.SaveVoteAsync(answerId, vote);
			return Ok(newVote);
		}

		// ANSWER COMMENT ========
		[AllowAnonymous]
		[HttpGet("{answerId}/comments")]
		public async Task<IActionResult> GetAnswerComments(int answerId, [FromQuery(Name = "index")] int indexParam)
		{
			var index = indexParam - 1 <= 0 ? 0 : indexParam - 1;
			var result = await this.answerCommentService.FetchComments(answerId, index);
			return Ok(result);
		}

		[AllowAnonymous]
		[HttpGet("{answerId}/comments/all")]
		public async Task<IActionResult> GetAllAnswerComments(int answerId)
		{
			var result = await this.answerCommentService.FetchAllComments(answerId);
			return Ok(result);
		}

		[HttpPost("{answerId}/comments")]
		public async Task<IActionResult> AddComment(int answerId, [FromBody]CommentsRequestViewModel qcvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			var response = await this.answerCommentService.AddCommentAsync(answerId, qcvm.Comment);
			return Ok(response);
		}


		[HttpPut("{answerId}/comments/{commentId}")]
		public async Task<IActionResult> UpdateComment(
			int answerId,
			int commentId,
			[FromBody]CommentsRequestViewModel qcvm)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.answerCommentService.UpdateCommentAsync(commentId, answerId, qcvm.Comment);
			return NoContent();
		}

		[HttpDelete("{answerId}/comments/{commentId}")]
		public async Task<IActionResult> DeleteComment(int answerId, int commentId)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			await this.answerCommentService.DeleteCommentAsync(commentId, answerId);
			return NoContent();
		}
	}
}