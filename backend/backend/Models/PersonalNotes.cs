using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("personal_notes")]
    public class PersonalNotes
    {
        [Key]
        [Column("idea_id")]
        public int IdeaId { get; set; }
        [Column("user_id")]
        public int UserID { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("content")]
        public string Content { get; set; }
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
    }
}
