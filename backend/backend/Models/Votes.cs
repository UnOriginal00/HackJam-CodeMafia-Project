using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("votes")]
    public class Votes
    {
        [Key]
        [Column("vote_id")]
        public int VoteID { get; set; }
        [Column("idea_id")]
        public int IdeaId { get; set; }
        [Column("user_id")]
        public int UserID { get; set; }
        [Column("vote_type")]
        public string VoteType { get; set; } = string.Empty;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
