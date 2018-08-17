using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QaNet.Contracts.Services;
using QaNet.Entities;
using QaNet.Entities.Domain;
using QaNet.Entities.Models;
using QaNet.Extensions;

namespace QaNet.Services
{
	public class DbInitializerService : IDbInitializerService
	{
		private readonly IServiceScopeFactory scopeFactory;

		private readonly ISecurityService securityService;

		public DbInitializerService(
				IServiceScopeFactory scopeFactory,
				ISecurityService securityService)
		{
			this.scopeFactory = scopeFactory;
			this.scopeFactory.CheckArgumentIsNull(nameof(DbInitializerService.scopeFactory));

			this.securityService = securityService;
			this.securityService.CheckArgumentIsNull(nameof(DbInitializerService.securityService));
		}

		public void Initialize()
		{
			using (var serviceScope = this.scopeFactory.CreateScope())
			{
				using (var context = serviceScope.ServiceProvider.GetService<QaContext>())
				{
					if (!context.Users.Any())
					{
						context.Database.Migrate();
					}
				}
			}
		}

		public void SeedData()
		{
			using (var serviceScope = this.scopeFactory.CreateScope())
			{
				using (var context = serviceScope.ServiceProvider.GetService<QaContext>())
				{
					// Add default roles
					var adminRole = new Role { Name = CustomRoles.Admin };
					var userRole = new Role { Name = CustomRoles.User };
					if (!context.Roles.Any())
					{
						context.Add(adminRole);
						context.Add(userRole);
						context.SaveChanges();
					}

					if (!context.Users.Any())
					{
						// Add Admin user
						var adminUser = new User
						{
							UserId = "shan",
							DisplayName = "Mozzie",
							IsActive = true,
							LastLoggedIn = null,
							Password = this.securityService.GetSha256Hash("mozzie"),
							SerialNumber = Guid.NewGuid().ToString("N")
						};
						context.Add(adminUser);
						context.SaveChanges();

						context.Add(new UserRole { Role = adminRole, User = adminUser });
						context.SaveChanges();

						var raj = new User
						{
							UserId = "raj",
							DisplayName = "Mozzie",
							IsActive = true,
							LastLoggedIn = null,
							Password = this.securityService.GetSha256Hash("mozzie"),
							SerialNumber = Guid.NewGuid().ToString("N")
						};
						context.Add(raj);
						context.SaveChanges();

						context.Add(new UserRole { Role = userRole, User = raj });
						context.SaveChanges();

						var sherlock = new User
						{
							UserId = "sherlock",
							DisplayName = "Mozzie",
							IsActive = true,
							LastLoggedIn = null,
							Password = this.securityService.GetSha256Hash("mozzie"),
							SerialNumber = Guid.NewGuid().ToString("N")
						};
						context.Add(sherlock);
						context.SaveChanges();

						context.Add(new UserRole { Role = userRole, User = sherlock });
						context.SaveChanges();
					}

					if (!context.Tags.Any()) 
					{
						var csharp = new Tag
						{
							Id = "csharp",
							Description = "csharp is an awesome language",
							CreatedBy= "shan",
							UpdatedBy="shan",
							CreatedAt=DateTime.Now,
							UpdatedAt= DateTime.Now
						};
						context.Add(csharp);
							
						var fsharp = new Tag
						{
							Id = "fsharp",
							Description = "fsharp is an awesome language",
							CreatedBy= "shan",
							UpdatedBy="shan",
							CreatedAt=DateTime.Now,
							UpdatedAt= DateTime.Now
						};
						context.Add(fsharp);
						context.SaveChanges();
					}
				}
			}
		}
	}
}