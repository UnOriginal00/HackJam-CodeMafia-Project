using System.Threading.Tasks;
using backend.Data;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DashboardService
    {
        private readonly HackJamDbContext _context;

        public DashboardService(HackJamDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboardForUserAsync(int userId)
        {
            if (userId <= 0) throw new System.ArgumentException("Invalid user id.", nameof(userId));

            var user = await _context.Users
                .Include(u => u.UserDetail)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) throw new System.InvalidOperationException("User not found.");

            var memberCount = await _context.UserGroups.CountAsync(ug => ug.UserId == userId);
            var ideasCount = await _context.ideas.CountAsync(i => i.UserID == userId);
            var createdCount = await _context.group_Lists.CountAsync(g => g.CreatorUserId == userId);

            // totalUpvotes left as 0 until a votes model exists
            return new DashboardDto
            {
                UserId = user.UserId,
                Name = user.UserDetail?.Name,
                Email = user.Email,
                TotalGroupsMemberOf = memberCount,
                TotalIdeasPosted = ideasCount,
                GroupsCreated = createdCount,
                TotalUpvotes = 0
            };
        }
    }
}