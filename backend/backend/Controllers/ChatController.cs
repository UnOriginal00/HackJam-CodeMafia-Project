using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using backend.Models.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        // GET /api/chat/{groupId}/history
        [HttpGet("{groupId}/history")]
        public async Task<IActionResult> GetHistory(int groupId)
        {
            if (groupId <= 0) return BadRequest(new { message = "Invalid groupId" });

            var messages = await _chatService.GetChatHistoryAsync(groupId);
            return Ok(messages);
        }

        // POST /api/chat/send
        // SIMPLE: no authentication required; accept a small DTO (no createdAt) so the server sets timestamps
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (request.GroupID <= 0 || request.UserID <= 0)
                return BadRequest(new { message = "Invalid GroupID or UserID." });

            var chat = new Chat_History
            {
                GroupID = request.GroupID,
                UserID = request.UserID,
                MessageText = request.MessageText
                // CreatedAt will be set by ChatService.SendMessageAsync
            };

            try
            {
                var created = await _chatService.SendMessageAsync(chat);
                return CreatedAtAction(nameof(GetHistory), new { groupId = created.GroupID }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { message = "Failed to send message." });
            }
        }
    }
}


