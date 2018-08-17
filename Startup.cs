using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using QaNet.Contracts.Services;
using QaNet.Entities.Domain;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;
using QaNet.Middlewares;

namespace QaNet
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.ConfigureSettings(this.Configuration);

			services.ConfigureCors();

			services.ConfigureAppServices();

			services.AddAutoMapper();

			// services.ConfigureMSSqlContext(this.Configuration);
			services.ConfigureSqliteContext(this.Configuration);

			services.ConfigureRespositoryWrapper();

			services.ConfigureAuthentication(this.Configuration);

			// Add this later
			// services.AddAntiforgery(x => x.HeaderName = "X-XSRF-TOKEN");

			services.AddMvc(options =>
			{
				// options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
			}).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

			// In production, the Angular files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "AngularClient";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				app.UseHsts();
			}

			app.UseCors("CorsPolicy");

			app.UseAuthentication();

			var scopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
			using (var scope = scopeFactory.CreateScope())
			{
				var dbInitializer = scope.ServiceProvider.GetService<IDbInitializerService>();
				dbInitializer.Initialize();
				dbInitializer.SeedData();
			}

			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseMiddleware(typeof(ErrorHandlingMiddleware));

			app.UseMvc(routes =>
			{
				routes.MapRoute(
									name: "default",
									template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "AngularClient";

				if (env.IsDevelopment())
				{
					// spa.UseAngularCliServer(npmScript: "start");
					spa.UseProxyToSpaDevelopmentServer("http://localhost:3500");
				}
			});
		}
	}
}
