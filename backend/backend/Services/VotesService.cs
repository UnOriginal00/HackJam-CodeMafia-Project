using System;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class VotesService
    {
        private readonly HackJamDbContext _context;

        public VotesService(HackJamDbContext context)
        {
            _context = context;
        }

        public async Task<VoteCountsDto> GetCountsAsync(int ideaId)
        {
            if (ideaId <= 0) throw new ArgumentException("Invalid idea id.", nameof(ideaId));

            var up = await _context.votes.CountAsync(v => v.IdeaId == ideaId && v.VoteTypeRaw == "up");
            var down = await _context.votes.CountAsync(v => v.IdeaId == ideaId && v.VoteTypeRaw == "down");

            return new VoteCountsDto { UpVotes = up, DownVotes = down };
        }

        // Cast a vote: create / update / remove (toggle)
        public async Task<VoteActionResult> CastVoteAsync(VoteRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (request.UserID <= 0 || request.IdeaID <= 0) throw new ArgumentException("Invalid user or idea id.");
            var typeStr = request.VoteType?.Trim().ToLower();
            if (typeStr != "up" && typeStr != "down") throw new ArgumentException("voteType must be 'up' or 'down'.");

            // verify user & idea existence
            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserID);
            if (!userExists) throw new InvalidOperationException("User does not exist.");

            var ideaExists = await _context.ideas.AnyAsync(i => i.IdeaId == request.IdeaID);
            if (!ideaExists) throw new InvalidOperationException("Idea does not exist.");

            var existing = await _context.votes.FirstOrDefaultAsync(v => v.UserID == request.UserID && v.IdeaId == request.IdeaID);

            string action;
            if (existing == null)
            {
                var vote = new Votes
                {
                    UserID = request.UserID,
                    IdeaId = request.IdeaID,
                    VoteTypeRaw = typeStr,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.votes.AddAsync(vote);
                await _context.SaveChangesAsync();
                action = "created";
            }
            else
            {
                if (existing.VoteTypeRaw == typeStr)
                {
                    // toggle off (remove)
                    _context.votes.Remove(existing);
                    await _context.SaveChangesAsync();
                    action = "removed";
                }
                else
                {
                    // change vote type
                    existing.VoteTypeRaw = typeStr;
                    existing.CreatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    action = "updated";
                }
            }

            var counts = await GetCountsAsync(request.IdeaID);
            return new VoteActionResult { Action = action, Counts = counts };
        }
    }
}
