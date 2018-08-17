using System;
using System.Collections.Generic;

namespace QaNet.Entities.Models
{
  public class User
  {
    public User()
    {
      UserRoles = new HashSet<UserRole>();
      UserTokens = new HashSet<UserToken>();
    }

    public string UserId { get; set; }
    public string Password { get; set; }
    public string DisplayName { get; set; }

    public bool IsActive { get; set; }

    public int Points { get; set; }

    public DateTimeOffset? LastLoggedIn { get; set; }

    /// <summary>
    /// every time the user changes his Password,
    /// or an admin changes his Roles or stat/IsActive,
    /// create a new `SerialNumber` GUID and store it in the DB.
    /// </summary>
    public string SerialNumber { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; }

    public virtual ICollection<UserToken> UserTokens { get; set; }
  }
}