using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("user_groups")]
    public class User_Groups
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("group_id")]
        public int GroupId { get; set; }

        // optional: timestamp when user joined the group
        [Column("joined_at")]
        public DateTime? JoinedAt { get; set; }
    }
}