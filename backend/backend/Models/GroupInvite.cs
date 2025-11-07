using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("group_invites")]
    public class GroupInvite
    {
        [Key]
        [Column("invite_id")]
        public int InviteId { get; set; }

        [Column("group_id")]
        public int GroupId { get; set; }

        [Column("sender_user_id")]
        public int SenderUserId { get; set; }

        [Column("recipient_user_id")]
        public int RecipientUserId { get; set; }

        [Column("message")]
        public string? Message { get; set; }

        [Column("status")]
        public string Status { get; set; } = InviteStatus.Pending.ToString();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("expires_at")]
        public DateTime? ExpiresAt { get; set; }
    }

    public enum InviteStatus
    {
        Pending,
        Accepted,
        Declined,
        Cancelled,
        Expired
    }
}