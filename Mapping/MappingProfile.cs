using AutoMapper;
using QaNet.Entities.Models;
using QaNet.Entities.ViewModels;

namespace QaNet.Mapping
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      // Domain to ViewModel
      CreateMap<Tag, TagViewModel>();

      // ViewModel to Domain
      CreateMap<TagViewModel, Tag>();
    }
  }
}