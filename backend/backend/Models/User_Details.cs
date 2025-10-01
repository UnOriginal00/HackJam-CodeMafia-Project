namespace backend.Models
{
    public class User_Details
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surename { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public User User { get; set; }
    }
}
