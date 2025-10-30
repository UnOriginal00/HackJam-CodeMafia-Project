using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("user_groups")]
    public class UserGroups
    {
        [Key]
        [Column]
        public int UserID { get; set; }
        [Key]
        [Column]
        public int GroupId { get; set; }
    }
}
