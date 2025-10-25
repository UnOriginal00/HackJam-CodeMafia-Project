using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ai_generated_data")]
    public class AI_Generated_Data
    {
        /*public int EntryId { get; set; }
        public int UserId { get; set; }
        public int DataType { get; set; }
        public string Content { get; set; }
        public DateTime GeneratedAt { get; set; }*/

        [Key]
        [Column("entry_id")]
        public int EntryId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("data_type")]
        public string DataType { get; set; }  // ENUM('summary', 'suggestion', 'reminder')

        [Column("content")]
        public string Content { get; set; }

        [Column("generated_at")]
        public DateTime GeneratedAt { get; set; }
    }
}
