using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using System.Collections.Generic;

namespace backend.Services
{
    public class ChatService
    {
        private readonly HackJamDbContext _context;

        public ChatService(HackJamDbContext context)
        {
            _context = context;
        }

        // Simple: return all messages for a group ordered by CreatedAt
        public async Task<List<ChatMessageDto>> GetChatHistoryAsync(int groupId)
        {
            if (groupId <= 0) throw new ArgumentException("groupId must be positive.", nameof(groupId));

            var query = _context.ChatHistory
                .Where(c => c.GroupID == groupId)
                .Join(
                    _context.UserDetails,
                    chat => chat.UserID,
                    details => details.UserId,
                    (chat, details) => new ChatMessageDto
                    {
                        MessageID = chat.MessageID,
                        GroupID = chat.GroupID,
                        UserID = chat.UserID,
                        Name = details.Name,
                        Surname = details.Surname,
                        MessageText = chat.MessageText,
                        CreatedAt = chat.CreatedAt
                    }
                )
                .OrderBy(c => c.CreatedAt)
                .AsNoTracking();

            return await query.ToListAsync();
        }

        // Keep the paged version if you need it later
        public async Task<PagedResult<ChatMessageDto>> GetChatHistoryWithUserNamesAsync(int groupId, int page = 1, int pageSize = 50)
        {
            if (groupId <= 0) throw new ArgumentException("groupId must be positive.", nameof(groupId));
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 50;

            var query = _context.ChatHistory
                .Where(c => c.GroupID == groupId)
                .Join(
                    _context.UserDetails,
                    chat => chat.UserID,
                    details => details.UserId,
                    (chat, details) => new ChatMessageDto
                    {
                        MessageID = chat.MessageID,
                        GroupID = chat.GroupID,
                        UserID = chat.UserID,
                        Name = details.Name,
                        Surname = details.Surname,
                        MessageText = chat.MessageText,
                        CreatedAt = chat.CreatedAt
                    }
                )
                .OrderBy(c => c.CreatedAt)
                .AsNoTracking();

            var total = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<ChatMessageDto>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            };
        }

        // Sends messages back to front end with info
        public async Task<Chat_History> SendMessageAsync(Chat_History message)
        {
            if (message == null)
                throw new ArgumentNullException(nameof(message));

            if (string.IsNullOrWhiteSpace(message.MessageText))
                throw new ArgumentException("Message text cannot be empty.", nameof(message.MessageText));

            if (message.GroupID <= 0)
                throw new ArgumentException("Invalid GroupID.", nameof(message.GroupID));

            if (message.UserID <= 0)
                throw new ArgumentException("Invalid UserID.", nameof(message.UserID));

            var groupExists = await _context.group_Lists.AnyAsync(g => g.GroupId == message.GroupID);
            if (!groupExists)
                throw new InvalidOperationException("Group does not exist");

            var userExists = await _context.Users.AnyAsync(u => u.UserId == message.UserID);
            if (!userExists)
                throw new InvalidOperationException("User does not exist");

            message.CreatedAt = DateTime.UtcNow;

            _context.ChatHistory.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }
    }
}
