using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("group_list")]
    public class Group_List
    {
        [Key]
        [Column("group_id")]
        public int GroupId { get; set; }
        [Column("group_name")]
        public string GroupName { get; set; } = string.Empty;
        [Column("description")]
        public string Description { get; set; } = string.Empty;
        [Column("creator_user_id")]
        public int? CreatorUserId { get; set; }
        [Column("created_at")]
        public DateTime CreatedDate { get; set; }

        // navigation: join rows for this group's members
        public ICollection<User_Groups> Members { get; set; } = new List<User_Groups>();
    }
}
