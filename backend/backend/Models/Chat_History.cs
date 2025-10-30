using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("chat_history")]
    public class Chat_History
    {
        [Key]
        [Column("message_id")]
        public int MessageID { get; set; }

        [Column("group_id")]
        public int GroupID { get; set; }

        [Column("user_id")]
        public int UserID { get; set; }

        [Column("message_text")]
        public string MessageText { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
