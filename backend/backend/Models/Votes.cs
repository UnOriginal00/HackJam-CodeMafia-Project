using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum VoteType
    {
        Up,
        Down
    }

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

        // mapped to the DB ENUM('up','down') via conversion in DbContext
        [NotMapped]
        public VoteType VoteType { get; set; }

        // keep a backing property for EF mapping if you prefer (optional)
        [Column("vote_type")]
        public string VoteTypeRaw
        {
            get => VoteType.ToString().ToLower();
            set => VoteType = Enum.TryParse<VoteType>(value, true, out var v) ? v : VoteType.Up;
        }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
