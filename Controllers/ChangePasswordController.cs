using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using QaNet.Contracts.Services;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  public class ChangePasswordController : Controller
  {
    private readonly IUsersService usersService;

    public ChangePasswordController(IUsersService usersService)
    {
      this.usersService = usersService;
      this.usersService.CheckArgumentIsNull(nameof(usersService));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Post([FromBody]ChangePasswordViewModel model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var user = await this.usersService.GetCurrentUserAsync();
      if (user == null)
      {
        return BadRequest("NotFound");
      }

      var result = await this.usersService.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
      if (result.Succeeded)
      {
        return Ok();
      }

      return BadRequest(result.Error);
    }
  }
}