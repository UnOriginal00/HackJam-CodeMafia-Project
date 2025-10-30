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
        public DbSet<Group_List> group_Lists { get; set; }
        public DbSet<AI_Generated_Data> aI_Generated_Datas { get; set; }
        public DbSet<Chat_History> ChatHistory { get; set; }
        public DbSet<Ideas> ideas { get; set; }
        public DbSet<Votes> votes { get; set; }
        public DbSet<Notes> notes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the one-to-one relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserDetail)
                .WithOne(d => d.User)
                .HasForeignKey<User_Details>(d => d.UserId);
        }

    }
}
