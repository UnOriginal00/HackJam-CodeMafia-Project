using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    // DTO for creating a group
    public class GroupCreateRequest
    {
        [Required]
        [JsonPropertyName("creatorUserID")]
        public int CreatorUserID { get; set; }

        [Required]
        [StringLength(100)]
        [JsonPropertyName("groupName")]
        public string GroupName { get; set; } = string.Empty;

        [StringLength(500)]
        [JsonPropertyName("description")]
        public string? Description { get; set; }
    }
}