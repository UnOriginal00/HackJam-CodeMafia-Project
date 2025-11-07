using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    public class SendInviteRequest
    {
        [JsonPropertyName("groupId")]
        public int GroupId { get; set; }

        [JsonPropertyName("recipientUserId")]
        public int RecipientUserId { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }
    }

    public class InviteActionRequest
    {
        [JsonPropertyName("inviteId")]
        public int InviteId { get; set; }
    }

    public class InviteDto
    {
        [JsonPropertyName("inviteId")]
        public int InviteId { get; set; }

        [JsonPropertyName("groupId")]
        public int GroupId { get; set; }

        [JsonPropertyName("senderUserId")]
        public int SenderUserId { get; set; }

        [JsonPropertyName("recipientUserId")]
        public int RecipientUserId { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "Pending";

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}