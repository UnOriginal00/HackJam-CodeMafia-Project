using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace backend.Data
{
    public class HackJamDbContext : DbContext
    {  

        public HackJamDbContext(DbContextOptions<HackJamDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<User_Details> UserDetails { get; set; }
    }
}
