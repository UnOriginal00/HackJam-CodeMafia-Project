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
    public class IdeasService
    {
        private readonly HackJamDbContext _context;

        public IdeasService(HackJamDbContext context)
        {
            _context = context;
        }

        public async Task<Ideas> CreateIdeaAsync(IdeaCreateRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.Title)) throw new ArgumentException("Title is required.", nameof(request.Title));
            if (string.IsNullOrWhiteSpace(request.Content)) throw new ArgumentException("Content is required.", nameof(request.Content));

            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserID);
            if (!userExists) throw new InvalidOperationException("User does not exist.");

            var groupExists = await _context.group_Lists.AnyAsync(g => g.GroupId == request.GroupID);
            if (!groupExists) throw new InvalidOperationException("Group does not exist.");

            var idea = new Ideas
            {
                GroupID = request.GroupID,
                UserID = request.UserID,
                Title = request.Title,
                Content = request.Content,
                CreatedDate = DateTime.UtcNow
            };

            await _context.ideas.AddAsync(idea);
            await _context.SaveChangesAsync();
            return idea;
        }

        public async Task<Ideas?> GetByIdAsync(int id)
        {
            if (id <= 0) return null;
            return await _context.ideas.AsNoTracking().FirstOrDefaultAsync(i => i.IdeaId == id);
        }

        // Update an idea (only the author can update)
        public async Task<Ideas> UpdateIdeaAsync(IdeaUpdateRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.IdeaId <= 0) throw new ArgumentException("Invalid idea id.", nameof(request.IdeaId));
            if (string.IsNullOrWhiteSpace(request.Title)) throw new ArgumentException("Title is required.", nameof(request.Title));
            if (string.IsNullOrWhiteSpace(request.Content)) throw new ArgumentException("Content is required.", nameof(request.Content));

            var idea = await _context.ideas.FirstOrDefaultAsync(i => i.IdeaId == request.IdeaId);
            if (idea == null) throw new InvalidOperationException("Idea does not exist.");

            if (idea.UserID != request.UserID)
                throw new UnauthorizedAccessException("Only the author can edit this idea.");

            idea.Title = request.Title;
            idea.Content = request.Content;

            await _context.SaveChangesAsync();
            return idea;
        }

        // Delete an idea (only the author can delete)
        public async Task DeleteIdeaAsync(int ideaId, int userId)
        {
            if (ideaId <= 0) throw new ArgumentException("Invalid idea id.", nameof(ideaId));
            if (userId <= 0) throw new ArgumentException("Invalid user id.", nameof(userId));

            var idea = await _context.ideas.FirstOrDefaultAsync(i => i.IdeaId == ideaId);
            if (idea == null) throw new InvalidOperationException("Idea does not exist.");

            if (idea.UserID != userId)
                throw new UnauthorizedAccessException("Only the author can delete this idea.");

            _context.ideas.Remove(idea);
            await _context.SaveChangesAsync();
        }

        // new: return all ideas for a group (most recent first)
        public async Task<IEnumerable<Ideas>> GetIdeasByGroupAsync(int groupId)
        {
            if (groupId <= 0) throw new ArgumentException("Invalid group id.", nameof(groupId));

            var groupExists = await _context.group_Lists.AnyAsync(g => g.GroupId == groupId);
            if (!groupExists) throw new InvalidOperationException("Group does not exist.");

            return await _context.ideas
                .AsNoTracking()
                .Where(i => i.GroupID == groupId)
                .OrderByDescending(i => i.CreatedDate)
                .ToListAsync();
        }
    }
}
