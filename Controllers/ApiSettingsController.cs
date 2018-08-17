using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;

namespace QaNet.Controllers
{
  [Route("api/[controller]")]
  public class ApiSettingsController : Controller
  {
    private readonly IOptionsSnapshot<ApiSettingsViewModel> apiSettingsConfig;

    public ApiSettingsController(IOptionsSnapshot<ApiSettingsViewModel> apiSettingsConfig)
    {
      this.apiSettingsConfig = apiSettingsConfig;
      this.apiSettingsConfig.CheckArgumentIsNull(nameof(apiSettingsConfig));
    }

    [AllowAnonymous]
    [HttpGet]
    public IActionResult Get()
    {
      return Ok(this.apiSettingsConfig.Value); // For the Angular Client
    }
  }
}