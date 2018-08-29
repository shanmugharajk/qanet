using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.CustomExceptions;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Controllers
{
	[Route("api/[controller]")]
	public class AccountController : Controller
	{
		private readonly IUsersService usersService;

		private readonly ITokenStoreService tokenStoreService;

		private readonly IUnitOfWork uow;

		private readonly IAntiforgery antiforgery;

		public AccountController(
				IUsersService usersService,
				ITokenStoreService tokenStoreService,
				IUnitOfWork uow,
				IAntiforgery antiforgery)
		{
			this.usersService = usersService;
			this.usersService.CheckArgumentIsNull(nameof(usersService));

			this.tokenStoreService = tokenStoreService;
			this.tokenStoreService.CheckArgumentIsNull(nameof(tokenStoreService));

			this.uow = uow;
			this.uow.CheckArgumentIsNull(nameof(AccountController.uow));

			this.antiforgery = antiforgery;
			this.antiforgery.CheckArgumentIsNull(nameof(antiforgery));
		}

		[AllowAnonymous]
		[IgnoreAntiforgeryToken]
		[HttpPost("signin")]
		public async Task<IActionResult> Login([FromBody]LoginViewModel loginViewModel)
		{
			if (ModelState.IsValid == false)
			{
				return BadRequest(ModelState);
			}

			var user = await this.usersService.FindUserAsync(loginViewModel.UserId, loginViewModel.Password);
			if (user == null || !user.IsActive)
			{
				throw new QaException("You've entered Invalid credentials");
			}

			var (accessToken, refreshToken, claims) = await this.tokenStoreService.CreateJwtTokensAsync(user, refreshTokenSource: null);

			regenerateAntiForgeryCookie(claims);

			return Ok(new { accessToken = accessToken, refreshToken = refreshToken });
		}


		[AllowAnonymous]
		[HttpPost("signup")]
		public async Task<IActionResult> UserSignUp([FromBody]UserSignUpRequestViewModel userSignUpVm)
		{
			await this.usersService.SignUp(userSignUpVm);
			return NoContent();
		}

		[AllowAnonymous]
		[HttpPost("[action]")]
		public async Task<IActionResult> RefreshToken([FromBody]JToken jsonBody)
		{
			var refreshToken = jsonBody.Value<string>("refreshToken");
			if (string.IsNullOrWhiteSpace(refreshToken))
			{
				return BadRequest("refreshToken is not set.");
			}

			var token = await this.tokenStoreService.FindTokenAsync(refreshToken);
			if (token == null)
			{
				return Unauthorized();
			}

			var (accessToken, newRefreshToken, claims) = await this.tokenStoreService.CreateJwtTokensAsync(token.User, refreshToken);

			regenerateAntiForgeryCookie(claims);

			return Ok(new { accessToken = accessToken, refreshToken = newRefreshToken });
		}

		private void regenerateAntiForgeryCookie(IEnumerable<Claim> claims)
		{
			this.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme));
			var tokens = this.antiforgery.GetAndStoreTokens(this.HttpContext);

			this.HttpContext.Response.Cookies.Append(
						key: "XSRF-TOKEN",
						value: tokens.RequestToken,
						options: new CookieOptions
						{
							HttpOnly = false // Now JavaScript is able to read the cookie
						});
		}

		[AllowAnonymous]
		[HttpGet("[action]")]
		public async Task<bool> Logout(string refreshToken)
		{
			var claimsIdentity = this.User.Identity as ClaimsIdentity;
			var userIdValue = claimsIdentity.FindFirst(ClaimTypes.UserData)?.Value;

			// The Jwt implementation does not support "revoke OAuth token" (logout) by design.
			// Delete the user's tokens from the database (revoke its bearer token)
			await this.tokenStoreService.RevokeUserBearerTokensAsync(userIdValue, refreshToken);
			await this.uow.SaveChangesAsync();

			return true;
		}

		[HttpGet("[action]"), HttpPost("[action]")]
		public bool IsAuthenticated()
		{
			return User.Identity.IsAuthenticated;
		}

		[HttpGet("[action]"), HttpPost("[action]")]
		public IActionResult GetUserInfo()
		{
			var claimsIdentity = User.Identity as ClaimsIdentity;
			return Json(new { Username = claimsIdentity.Name });
		}
	}
}