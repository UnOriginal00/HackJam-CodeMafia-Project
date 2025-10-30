using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    // Incoming DTO for POST /api/chat/send
    public class ChatMessageRequest
    {
        [JsonPropertyName("groupID")]
        public int GroupID { get; set; }

        [JsonPropertyName("userID")]
        public int UserID { get; set; }

        // Keep the validation message consistent with what you saw
        [Required(ErrorMessage = "The message field is required.")]
        [JsonPropertyName("messageText")]
        public string MessageText { get; set; } = string.Empty;
    }
}