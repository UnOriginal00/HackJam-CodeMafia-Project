using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    public class IdeaCreateRequest
    {
        [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        [JsonPropertyName("userID")]
        public int UserID { get; set; }

        [Required]
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    public class IdeaUpdateRequest
    {
        [JsonPropertyName("ideaId")]
        public int IdeaId { get; set; }

        [JsonPropertyName("userID")]
        public int UserID { get; set; }

        [Required]
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;
    }

    public class IdeaDeleteRequest
    {
        [JsonPropertyName("userID")]
        public int UserID { get; set; }
    }
}