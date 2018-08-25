using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using QaNet.Contracts.Repository;
using QaNet.Contracts.Services;
using QaNet.Entities;
using QaNet.Entities.Domain;
using QaNet.Entities.ViewModels;
using QaNet.Respositories;
using QaNet.Services;

namespace QaNet.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureCors(this IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy("CorsPolicy",
									builder => builder.AllowAnyOrigin()
									.AllowAnyMethod()
									.AllowAnyHeader()
									.AllowCredentials());
			});
		}

		public static void ConfigureMSSqlContext(this IServiceCollection services, IConfiguration config)
		{
			var connectionString = config["ConnectionStrings:DefaultConnection"];
			services.AddDbContext<QaContext>(o => o.UseSqlServer(connectionString));
		}

		public static void ConfigureSqliteContext(this IServiceCollection services, IConfiguration config)
		{
			var connectionString = config["ConnectionStrings:SqliteConnection"];
			// ServiceLifetime.Transient => makes the auth failure
			// TODO : Must have a look at this soon.
			// https://stackoverflow.com/questions/41923804/configuring-dbcontext-as-transient

			// services.AddDbContext<QaContext>(
			// 	o => o.UseSqlite(connectionString), ServiceLifetime.Transient);
			services.AddDbContext<QaContext>(o => o.UseSqlite(connectionString));
		}

		public static void ConfigureRespositoryWrapper(this IServiceCollection services)
		{
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();
		}

		public static void ConfigureAppServices(this IServiceCollection services)
		{
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddScoped<IUsersService, UsersService>();
			services.AddScoped<ISecurityService, SecurityService>();
			services.AddScoped<ITokenStoreService, TokenStoreService>();
			services.AddScoped<ITokenValidatorService, TokenValidatorService>();
			services.AddScoped<IDbInitializerService, DbInitializerService>();
			services.AddScoped<IQuestionsService, QuestionsService>();
			services.AddScoped<IAnswersService, AnswersService>();
			services.AddScoped<IQuestionCommentService, QuestionCommentService>();
			services.AddScoped<IAnswerCommentService, AnswerCommentService>();
			services.AddScoped<IQuestionVotingService, QuestionVotingService>();
			services.AddScoped<IAnswerVotingService, AnswerVotingService>();
			services.AddScoped<IBookmarkService, BookmarkService>();
		}

		public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration config)
		{
			// Only needed for custom roles.
			services.AddAuthorization(options =>
			{
				options.AddPolicy(CustomRoles.Admin, policy => policy.RequireRole(CustomRoles.Admin));
				options.AddPolicy(CustomRoles.User, policy => policy.RequireRole(CustomRoles.User));
			});

			// Needed for jwt auth.
			services
					.AddAuthentication(options =>
					{
						options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
						options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
						options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					})
					.AddJwtBearer(cfg =>
					{
						cfg.RequireHttpsMetadata = false;
						cfg.SaveToken = true;
						cfg.TokenValidationParameters = new TokenValidationParameters
						{
							ValidIssuer = config["BearerTokens:Issuer"], // site that makes the token
							ValidateIssuer = false, // TODO: change this to avoid forwarding attacks
							ValidAudience = config["BearerTokens:Audience"], // site that consumes the token
							ValidateAudience = false, // TODO: change this to avoid forwarding attacks
							IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["BearerTokens:Key"])),
							ValidateIssuerSigningKey = true, // verify signature to avoid tampering
							ValidateLifetime = true, // validate the expiration
							ClockSkew = TimeSpan.Zero // tolerance for the expiration date
						};
						cfg.Events = new JwtBearerEvents
						{
							OnAuthenticationFailed = context =>
										{
											var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(JwtBearerEvents));
											logger.LogError("Authentication failed.", context.Exception);
											return Task.CompletedTask;
										},
							OnTokenValidated = context =>
										{
											var tokenValidatorService = context.HttpContext.RequestServices.GetRequiredService<ITokenValidatorService>();
											return tokenValidatorService.ValidateAsync(context);
										},
							OnMessageReceived = context =>
										 {
											 return Task.CompletedTask;
										 },
							OnChallenge = context =>
										{
											var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(JwtBearerEvents));
											logger.LogError("OnChallenge error", context.Error, context.ErrorDescription);
											return Task.CompletedTask;
										}
						};
					});
		}

		public static void ConfigureSettings(this IServiceCollection services, IConfiguration config)
		{
			services.Configure<BearerTokensOptions>(options => config.GetSection("BearerTokens").Bind(options));
			services.Configure<ApiSettingsViewModel>(options => config.GetSection("ApiSettings").Bind(options));
		}
	}
}