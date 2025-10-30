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

        // Add DbSet for user_groups join table
        public DbSet<User_Groups> UserGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the one-to-one relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserDetail)
                .WithOne(d => d.User)
                .HasForeignKey<User_Details>(d => d.UserId);

            // Configure composite key and relationships for user_groups join table
            modelBuilder.Entity<User_Groups>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });

            modelBuilder.Entity<User_Groups>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(ug => ug.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User_Groups>()
                .HasOne<Group_List>()
                .WithMany()
                .HasForeignKey(ug => ug.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
