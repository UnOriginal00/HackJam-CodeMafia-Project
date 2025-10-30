using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ideas")]
    public class Ideas
    {
        [Key]
        [Column("idea_id")]
        public int IdeaId { get; set; }
        [Column("group_id")]
        public int GroupID { get; set; }
        [Column("user_id")]
        public int UserID { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("content")]
        public string Content { get; set; }
        [Column("created_at")]
        public DateTime CreatedDate { get; set; }
    }
}
