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
        public DbSet<User_Groups> UserGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // one-to-one user -> user_details
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserDetail)
                .WithOne(d => d.User)
                .HasForeignKey<User_Details>(d => d.UserId);

            // explicit unique index for group_name (keeps model + DB intent aligned)
            modelBuilder.Entity<Group_List>()
                .HasIndex(g => g.GroupName)
                .IsUnique();

            // configure composite key for user_groups and relationships
            modelBuilder.Entity<User_Groups>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });

            modelBuilder.Entity<User_Groups>()
                .HasOne<User>()
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User_Groups>()
                .HasOne<Group_List>()
                .WithMany(g => g.Members)
                .HasForeignKey(ug => ug.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
