using System.Text.Json.Serialization;

namespace backend.Models.DTOs
{
    public class DashboardDto
    {
        [JsonPropertyName("userId")]
        public int UserId { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("totalGroupsMemberOf")]
        public int TotalGroupsMemberOf { get; set; }

        [JsonPropertyName("totalIdeasPosted")]
        public int TotalIdeasPosted { get; set; }

        [JsonPropertyName("groupsCreated")]
        public int GroupsCreated { get; set; }

        // TODO: compute real upvotes when vote table exists
        [JsonPropertyName("totalUpvotes")]
        public int TotalUpvotes { get; set; } = 0;
    }
}