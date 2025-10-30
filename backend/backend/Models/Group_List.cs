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
        public string GroupName { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("created_at")]
        public DateTime CreatedDate { get; set; }
    }
}
