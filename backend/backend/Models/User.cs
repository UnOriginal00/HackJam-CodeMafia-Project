namespace backend.Models
{
    public class User
    {

        public int UserId { get; set; }           
        public int GroupId { get; set; }          
        public string Email { get; set; }         
        public string PasswordHash { get; set; }  
        public DateTime JoinedAt { get; set; } = DateTime.Now;


    }
}
