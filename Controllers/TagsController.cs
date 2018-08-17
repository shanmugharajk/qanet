using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QaNet.Contracts.Repository;
using QaNet.Entities.Domain;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;
using QaNet.Extensions;
using QaNet.Respositories;

namespace QaNet.Controllers
{
  [Route("api/[controller]")]
  [Authorize(Roles = CustomRoles.Admin)]
  public class TagsController : Controller
  {
    private readonly IRepositoryWrapper repository;

    private readonly IUnitOfWork uow;

    private readonly IMapper mapper;

    public TagsController(IMapper mapper, IRepositoryWrapper repository, IUnitOfWork uow)
    {
      this.mapper = mapper;
      this.mapper.CheckArgumentIsNull(nameof(TagsController.mapper));

      this.repository = repository;
      this.repository.CheckArgumentIsNull(nameof(TagsController.repository));

      this.uow = uow;
      this.uow.CheckArgumentIsNull(nameof(TagsController.uow));
    }

		[AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
      var tags = await this.repository.Tag.GetAsync();
      var result = this.mapper.Map<IEnumerable<Tag>, IEnumerable<TagViewModel>>(tags);
      return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
      var tags = await this.repository.Tag.FirstOrDefaultAsync(predicate: x => x.Id == id);
      return Ok(tags);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody]TagViewModel tagVm)
    {
      if (ModelState.IsValid == false)
      {
        return BadRequest(ModelState);
      }

      var tag = this.mapper.Map<TagViewModel, Tag>(tagVm);
      tag.CreatedAt = DateTime.Now;
      tag.UpdatedAt = DateTime.Now;
      tag.CreatedBy = this.HttpContext.GetCurrentUserId();
      tag.UpdatedBy = this.HttpContext.GetCurrentUserId();

      await this.repository.Tag.AddAsync(tag);
      await this.uow.SaveChangesAsync();

      return Ok(tagVm);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody]TagViewModel tagVm)
    {
      if (ModelState.IsValid == false)
      {
        return BadRequest(ModelState);
      }

      var tag = await this.repository.Tag.FirstOrDefaultAsync(predicate: i => i.Id == id);

      if (tag == null)
      {
        return NotFound();
      }

      this.mapper.Map<TagViewModel, Tag>(tagVm, tag);
      tag.UpdatedAt = DateTime.Now;
      tag.UpdatedBy = this.HttpContext.GetCurrentUserId();

      this.repository.Tag.Update(tag);

      await this.uow.SaveChangesAsync();

      tag = await this.repository.Tag.FirstOrDefaultAsync(predicate: i => i.Id == id);
      var result = this.mapper.Map<Tag, TagViewModel>(tag);

      return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
      var tag = await this.repository.Tag.FirstOrDefaultAsync(predicate: i => i.Id == id);

      if (tag == null)
      {
        return NotFound();
      }

      this.repository.Tag.DeleteById(id);

      await this.uow.SaveChangesAsync();

      return NoContent();
    }
  }
}