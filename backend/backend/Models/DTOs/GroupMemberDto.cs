using System;

namespace backend.Models.DTOs
{
    // Lightweight DTO for returning group member info
    public class GroupMemberDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? JoinedAt { get; set; }
    }
}
