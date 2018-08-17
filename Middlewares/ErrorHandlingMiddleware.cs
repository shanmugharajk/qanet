using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using QaNet.CustomExceptions;

namespace QaNet.Middlewares
{
	public class ErrorHandlingMiddleware
	{
		private readonly RequestDelegate next;

		public ErrorHandlingMiddleware(RequestDelegate next)
		{
			this.next = next;
		}

		public async Task Invoke(HttpContext context /* other dependencies */)
		{
			try
			{
				await next(context);
			}
			catch (Exception ex)
			{
				await HandleExceptionAsync(context, ex);
			}
		}

		private static Task HandleExceptionAsync(HttpContext context, Exception exception)
		{
			var code = HttpStatusCode.InternalServerError; // 500 if unexpected

			if (exception is QaException)
			{
				code = HttpStatusCode.BadRequest;
			}

			var result = "";

			if (exception is QaException)
			{
				result = JsonConvert.SerializeObject(new { message = exception.Message });
			}
			else
			{
				result = JsonConvert.SerializeObject(
					new
					{
						message = "Something went wrong. Please try again later",
						error = exception.Message
					});
			}

			context.Response.ContentType = "application/json";
			context.Response.StatusCode = (int)code;
			return context.Response.WriteAsync(result);
		}
	}
}