using System;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class GroupsService
    {
        private readonly HackJamDbContext _context;

        public GroupsService(HackJamDbContext context)
        {
            _context = context;
        }

        // Create a group and add a linking entry in user_groups for the creator
        public async Task<Group_List> CreateGroupAsync(GroupCreateRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.CreatorUserID <= 0) throw new ArgumentException("Invalid creator user id.", nameof(request.CreatorUserID));
            if (string.IsNullOrWhiteSpace(request.GroupName)) throw new ArgumentException("Group name is required.", nameof(request.GroupName));

            // Check for an existing group with the same name first to avoid duplicate-key DB error
            var existing = await _context.group_Lists
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.GroupName == request.GroupName);
            if (existing != null)
                throw new ArgumentException("A group with that name already exists.", nameof(request.GroupName));

            // ensure creator exists
            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.CreatorUserID);
            if (!userExists) throw new InvalidOperationException("Creator user does not exist.");

            var group = new Group_List
            {
                GroupName = request.GroupName,
                Description = request.Description ?? string.Empty,
                CreatedDate = DateTime.UtcNow
            };

            // Use a transaction so both inserts are atomic
            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.group_Lists.AddAsync(group);
                await _context.SaveChangesAsync(); // group.GroupId populated

                // Only add link if it does not already exist (prevents duplicate PK error)
                var linkExists = await _context.UserGroups
                    .AnyAsync(ug => ug.UserId == request.CreatorUserID && ug.GroupId == group.GroupId);

                if (!linkExists)
                {
                    var link = new User_Groups
                    {
                        UserId = request.CreatorUserID,
                        GroupId = group.GroupId,
                        JoinedAt = DateTime.UtcNow
                    };

                    await _context.UserGroups.AddAsync(link);
                    await _context.SaveChangesAsync();
                }

                await tx.CommitAsync();
                return group;
            }
            catch (DbUpdateException dbEx)
            {
                await tx.RollbackAsync();

                var inner = dbEx.InnerException?.Message ?? dbEx.Message;
                // Map DB duplicate-key to a friendly error — still throw so controller can decide status code
                if (inner.Contains("Duplicate entry") && inner.Contains("group_list"))
                    throw new ArgumentException("A group with that name already exists.", nameof(request.GroupName));

                throw new InvalidOperationException("Database error creating group: " + inner, dbEx);
            }
        }

        public async Task<Group_List?> GetGroupByIdAsync(int groupId)
        {
            if (groupId <= 0) return null;
            return await _context.group_Lists.AsNoTracking().FirstOrDefaultAsync(g => g.GroupId == groupId);
        }
    }
}