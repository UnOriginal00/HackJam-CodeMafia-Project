using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class HackJamDbContext : DbContext
    {
        public HackJamDbContext(DbContextOptions<HackJamDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<User_Details> UserDetails { get; set; }
        public DbSet<Group_List> group_Lists { get; set; }
        public DbSet<AI_Generated_Data> aI_Generated_Datas { get; set; }
        public DbSet<Chat_History> ChatHistory { get; set; }
        public DbSet<Ideas> ideas { get; set; }
        public DbSet<Votes> votes { get; set; }
        public DbSet<Notes> notes { get; set; }
        public DbSet<User_Groups> UserGroups { get; set; }
        public DbSet<GroupInvite> GroupInvites { get; set; } // New DbSet for GroupInvite

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserDetail)
                .WithOne(d => d.User)
                .HasForeignKey<User_Details>(d => d.UserId);

            modelBuilder.Entity<Group_List>()
                .HasIndex(g => g.GroupName)
                .IsUnique(false);

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

            // Map Votes.VoteTypeRaw <-> DB ENUM('up','down') stored in vote_type
            modelBuilder.Entity<Votes>()
                .Property(v => v.VoteTypeRaw)
                .HasColumnName("vote_type")
                .HasMaxLength(10);

            modelBuilder.Entity<GroupInvite>(eb => // Configuration for GroupInvite
            {
                eb.HasKey(i => i.InviteId);
                eb.Property(i => i.Status).HasMaxLength(32);
                eb.HasIndex(i => new { i.RecipientUserId });
                eb.HasIndex(i => new { i.GroupId });
            });
        }
    }
}
