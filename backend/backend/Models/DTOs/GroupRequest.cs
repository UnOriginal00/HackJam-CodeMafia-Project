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

    public class JoinGroupRequest
    {
        [JsonPropertyName("userID")]
        public int UserID { get; set; }

        [JsonPropertyName("groupID")]
        public int GroupID { get; set; }
    }

    public class RenameGroupRequest
    {
        [JsonPropertyName("creatorUserID")]
        public int CreatorUserID { get; set; }

        [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        [Required]
        [JsonPropertyName("newName")]
        public string NewName { get; set; } = string.Empty;
    }

    public class DeleteGroupRequest
    {
        [JsonPropertyName("creatorUserID")]
        public int CreatorUserID { get; set; }

        [JsonPropertyName("groupID")]
        public int GroupID { get; set; }
    }
}