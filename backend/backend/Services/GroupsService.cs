using System;
using System.Collections.Generic;
using System.Linq;
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
        private const int MaxGroupsPerUser = 5;

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

            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.CreatorUserID);
            if (!userExists) throw new InvalidOperationException("Creator user does not exist.");

            // count how many groups the user is already a member of
            var membershipCount = await _context.UserGroups.CountAsync(ug => ug.UserId == request.CreatorUserID);
            if (membershipCount >= MaxGroupsPerUser)
                throw new ArgumentException($"User is already a member of the maximum allowed {MaxGroupsPerUser} groups.");

            var group = new Group_List
            {
                GroupName = request.GroupName,
                Description = request.Description ?? string.Empty,
                CreatorUserId = request.CreatorUserID,
                CreatedDate = DateTime.UtcNow
            };

            // Use a transaction so both inserts are atomic
            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.group_Lists.AddAsync(group);
                await _context.SaveChangesAsync(); // group.GroupId populated

                // add creator as member (counts toward the 5)
                var link = new User_Groups
                {
                    UserId = request.CreatorUserID,
                    GroupId = group.GroupId,
                    JoinedAt = DateTime.UtcNow
                };

                await _context.UserGroups.AddAsync(link);
                await _context.SaveChangesAsync();

                await tx.CommitAsync();
                return group;
            }
            catch (DbUpdateException dbEx)
            {
                await tx.RollbackAsync();

                var inner = dbEx.InnerException?.Message ?? dbEx.Message;
                // Map DB duplicate-key to a friendly error � still throw so controller can decide status code
                if (inner.Contains("Duplicate entry") && inner.Contains("group_list"))
                    throw new ArgumentException("A group with that name already exists.", nameof(request.GroupName));

                throw new InvalidOperationException("Database error creating group: " + inner, dbEx);
            }
        }

        public async Task JoinGroupAsync(JoinGroupRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.UserID <= 0 || request.GroupID <= 0) throw new ArgumentException("Invalid user or group id.");

            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserID);
            if (!userExists) throw new InvalidOperationException("User does not exist.");

            var group = await _context.group_Lists.FirstOrDefaultAsync(g => g.GroupId == request.GroupID);
            if (group == null) throw new InvalidOperationException("Group does not exist.");

            var alreadyMember = await _context.UserGroups.AnyAsync(ug => ug.UserId == request.UserID && ug.GroupId == request.GroupID);
            if (alreadyMember) throw new ArgumentException("User is already a member of this group.");

            var membershipCount = await _context.UserGroups.CountAsync(ug => ug.UserId == request.UserID);
            if (membershipCount >= MaxGroupsPerUser)
                throw new ArgumentException($"User cannot belong to more than {MaxGroupsPerUser} groups.");

            var link = new User_Groups
            {
                UserId = request.UserID,
                GroupId = request.GroupID,
                JoinedAt = DateTime.UtcNow
            };

            await _context.UserGroups.AddAsync(link);
            await _context.SaveChangesAsync();
        }

        public async Task RenameGroupAsync(RenameGroupRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.GroupID <= 0 || request.CreatorUserID <= 0) throw new ArgumentException("Invalid ids.");
            if (string.IsNullOrWhiteSpace(request.NewName)) throw new ArgumentException("New name required.");

            var group = await _context.group_Lists.FirstOrDefaultAsync(g => g.GroupId == request.GroupID);
            if (group == null) throw new InvalidOperationException("Group does not exist.");

            if (group.CreatorUserId != request.CreatorUserID)
                throw new UnauthorizedAccessException("Only the creator can rename the group.");

            group.GroupName = request.NewName;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteGroupAsync(DeleteGroupRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.GroupID <= 0 || request.CreatorUserID <= 0) throw new ArgumentException("Invalid ids.");

            var group = await _context.group_Lists.FirstOrDefaultAsync(g => g.GroupId == request.GroupID);
            if (group == null) throw new InvalidOperationException("Group does not exist.");

            if (group.CreatorUserId != request.CreatorUserID)
                throw new UnauthorizedAccessException("Only the creator can delete the group.");

            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                // remove join links first (if cascade is configured this is optional)
                var links = _context.UserGroups.Where(ug => ug.GroupId == request.GroupID);
                _context.UserGroups.RemoveRange(links);

                _context.group_Lists.Remove(group);
                await _context.SaveChangesAsync();

                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<Group_List?> GetGroupByIdAsync(int groupId)
        {
            if (groupId <= 0) return null;
            return await _context.group_Lists.AsNoTracking().FirstOrDefaultAsync(g => g.GroupId == groupId);
        }

        // NEW: return user's groups (up to `limit` or MaxGroupsPerUser). Read-only.
        public async Task<IEnumerable<Group_List>> GetGroupsForUserAsync(int userId, int? limit = null)
        {
            if (userId <= 0) throw new ArgumentException("Invalid user id.", nameof(userId));

            // Ensure user exists
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists) throw new InvalidOperationException("User does not exist.");

            // Find group ids from the join table (User_Groups)
            var groupIds = await _context.UserGroups
                .AsNoTracking()
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.GroupId)
                .ToListAsync();

            if (groupIds == null || groupIds.Count == 0) return Array.Empty<Group_List>();

            var take = limit.HasValue ? Math.Max(0, limit.Value) : MaxGroupsPerUser;

            var groups = await _context.group_Lists
                .AsNoTracking()
                .Where(g => groupIds.Contains(g.GroupId))
                .OrderByDescending(g => g.CreatedDate)
                .Take(take)
                .ToListAsync();

            return groups;
        }

        // Return members for a given group
        public async Task<List<backend.Models.DTOs.GroupMemberDto>> GetGroupMembersAsync(int groupId)
        {
            if (groupId <= 0) throw new ArgumentException("Invalid group id.", nameof(groupId));

            var exists = await _context.group_Lists.AnyAsync(g => g.GroupId == groupId);
            if (!exists) throw new InvalidOperationException("Group does not exist.");

            var query = _context.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .Join(
                    _context.UserDetails,
                    ug => ug.UserId,
                    ud => ud.UserId,
                    (ug, ud) => new backend.Models.DTOs.GroupMemberDto
                    {
                        UserId = ud.UserId,
                        Name = ud.Name,
                        Surname = ud.Surname,
                        Email = ud.Email,
                        JoinedAt = ug.JoinedAt
                    }
                )
                .OrderBy(m => m.Name)
                .AsNoTracking();

            return await query.ToListAsync();
        }

        public async Task<GroupInvite> SendInviteAsync(SendInviteRequest request, int senderUserId)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.GroupId <= 0 || request.RecipientUserId <= 0) throw new ArgumentException("Invalid ids.");

            var group = await _context.group_Lists.FirstOrDefaultAsync(g => g.GroupId == request.GroupId);
            if (group == null) throw new InvalidOperationException("Group does not exist.");

            // ensure sender is a member (or creator)
            var isMember = await _context.UserGroups.AnyAsync(ug => ug.UserId == senderUserId && ug.GroupId == request.GroupId);
            if (!isMember) throw new UnauthorizedAccessException("Only group members can invite others.");

            // ensure recipient exists
            var recipientExists = await _context.Users.AnyAsync(u => u.UserId == request.RecipientUserId);
            if (!recipientExists) throw new InvalidOperationException("Recipient user does not exist.");

            // already member?
            var alreadyMember = await _context.UserGroups.AnyAsync(ug => ug.UserId == request.RecipientUserId && ug.GroupId == request.GroupId);
            if (alreadyMember) throw new ArgumentException("Recipient is already a member of the group.");

            // prevent duplicate pending invite
            var existingInvite = await _context.GroupInvites
                .FirstOrDefaultAsync(i => i.GroupId == request.GroupId
                                           && i.RecipientUserId == request.RecipientUserId
                                           && i.Status == InviteStatus.Pending.ToString());
            if (existingInvite != null) throw new InvalidOperationException("A pending invite already exists for that user.");

            var invite = new GroupInvite
            {
                GroupId = request.GroupId,
                SenderUserId = senderUserId,
                RecipientUserId = request.RecipientUserId,
                Message = request.Message,
                Status = InviteStatus.Pending.ToString(),
                CreatedAt = DateTime.UtcNow
            };

            await _context.GroupInvites.AddAsync(invite);
            await _context.SaveChangesAsync();
            return invite;
        }

        public async Task<IEnumerable<InviteDto>> GetInvitesForUserAsync(int userId)
        {
            var list = await _context.GroupInvites
                .AsNoTracking()
                .Where(i => i.RecipientUserId == userId && i.Status == InviteStatus.Pending.ToString())
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return list.Select(i => new InviteDto
            {
                InviteId = i.InviteId,
                GroupId = i.GroupId,
                SenderUserId = i.SenderUserId,
                RecipientUserId = i.RecipientUserId,
                Message = i.Message,
                Status = i.Status,
                CreatedAt = i.CreatedAt
            });
        }

        public async Task AcceptInviteAsync(int inviteId, int recipientUserId)
        {
            var invite = await _context.GroupInvites.FirstOrDefaultAsync(i => i.InviteId == inviteId);
            if (invite == null) throw new InvalidOperationException("Invite not found.");
            if (invite.RecipientUserId != recipientUserId) throw new UnauthorizedAccessException("Invite does not belong to user.");
            if (invite.Status != InviteStatus.Pending.ToString()) throw new InvalidOperationException("Invite is not pending.");

            // ensure not already member
            var alreadyMember = await _context.UserGroups.AnyAsync(ug => ug.UserId == recipientUserId && ug.GroupId == invite.GroupId);
            if (!alreadyMember)
            {
                var link = new User_Groups
                {
                    UserId = recipientUserId,
                    GroupId = invite.GroupId,
                    JoinedAt = DateTime.UtcNow
                };
                await _context.UserGroups.AddAsync(link);
            }

            invite.Status = InviteStatus.Accepted.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task DeclineInviteAsync(int inviteId, int recipientUserId)
        {
            var invite = await _context.GroupInvites.FirstOrDefaultAsync(i => i.InviteId == inviteId);
            if (invite == null) throw new InvalidOperationException("Invite not found.");
            if (invite.RecipientUserId != recipientUserId) throw new UnauthorizedAccessException("Invite does not belong to user.");
            if (invite.Status != InviteStatus.Pending.ToString()) throw new InvalidOperationException("Invite is not pending.");

            invite.Status = InviteStatus.Declined.ToString();
            await _context.SaveChangesAsync();
        }
    }
}