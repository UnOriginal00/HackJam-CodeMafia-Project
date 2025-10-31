using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("group_id")]
        public int? GroupId { get; set; } // nullable

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; } = DateTime.Now;

        public User_Details UserDetail { get; set; }

        // navigation: groups this user belongs to
        public ICollection<User_Groups> UserGroups { get; set; } = new List<User_Groups>();
    }
}
