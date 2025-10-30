using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("notes")]
    public class Notes
    {
        [Key]
        [Column("note_id")]
        public int NoteId { get; set; }
        [Column("group_id")]
        public int GroupID { get; set; }
        [Column("user_id")]
        public int UserID { get; set; }
        [Column("content")]
        public string Content { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
