using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("user_details")]
    public class User_Details
    {
        [Key]
        [ForeignKey("User")] // ← it's both PK and FK
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("surname")]
        public string Surname { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone_number")]
        public int PhoneNumber { get; set; }

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }

        public User User { get; set; }
    }
}
