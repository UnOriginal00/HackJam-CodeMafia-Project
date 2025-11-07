using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.DTOs
{
    public class SignupRequest
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string SurName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, MinLength(8)]
        public string Password { get; set; }
        [Required]
        // keep phone as string to match DB and model (accept formatted numbers)
        public string PhoneNumber { get; set; }
    }
}
