using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QaNet.Entities.Models
{
  public class BaseEntity
  {
    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
  }
}