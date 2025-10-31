using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    public class VoteRequest
    {
        [JsonPropertyName("userID")]
        public int UserID { get; set; }

        [JsonPropertyName("ideaID")]
        public int IdeaID { get; set; }

        // expected "up" or "down"
        [Required]
        [JsonPropertyName("voteType")]
        public string VoteType { get; set; } = string.Empty;
    }

    public class VoteCountsDto
    {
        [JsonPropertyName("upVotes")]
        public int UpVotes { get; set; }

        [JsonPropertyName("downVotes")]
        public int DownVotes { get; set; }
    }

    public class VoteActionResult
    {
        [JsonPropertyName("action")]
        public string Action { get; set; } = string.Empty; // "created" | "updated" | "removed"

        [JsonPropertyName("counts")]
        public VoteCountsDto Counts { get; set; } = new VoteCountsDto();
    }
}