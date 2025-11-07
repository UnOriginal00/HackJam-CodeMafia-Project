using backend.Services;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdeasController : ControllerBase
    {
        private readonly IdeasService _ideasService;

        public IdeasController(IdeasService ideasService)
        {
            _ideasService = ideasService;
        }

        // POST /api/ideas
        [HttpPost]
        public async Task<IActionResult> CreateIdea([FromBody] IdeaCreateRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            try
            {
                var created = await _ideasService.CreateIdeaAsync(request);
                return CreatedAtAction(nameof(GetIdea), new { id = created.IdeaId }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create idea.", detail = ex.Message });
            }
        }

        // GET /api/ideas/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIdea(int id)
        {
            var idea = await _ideasService.GetByIdAsync(id);
            if (idea == null) return NotFound(new { message = "Idea not found." });
            return Ok(idea);
        }

        // PUT /api/ideas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIdea(int id, [FromBody] IdeaUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (id != request.IdeaId)
                return BadRequest(new { message = "Idea id mismatch." });

            try
            {
                var updated = await _ideasService.UpdateIdeaAsync(request);
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update idea.", detail = ex.Message });
            }
        }

        // DELETE /api/ideas/{id}
        // body: { "userID": 123 }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdea(int id, [FromBody] IdeaDeleteRequest request)
        {
            if (request == null) return BadRequest(new { message = "Request body required." });

            try
            {
                await _ideasService.DeleteIdeaAsync(id, request.UserID);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete idea.", detail = ex.Message });
            }
        }

        // GET /api/ideas/group/{groupId}
        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetIdeasByGroup(int groupId)
        {
            try
            {
                var list = await _ideasService.GetIdeasByGroupAsync(groupId);
                return Ok(list);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch ideas.", detail = ex.Message });
            }
        }

        // NEW: GET /api/ideas/me - personal ideas for authenticated user
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyPersonalIdeas()
        {
            try
            {
                var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid") ?? User.FindFirst("sub");
                if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });

                if (!int.TryParse(idClaim.Value, out var userId))
                    return BadRequest(new { message = "Invalid user id in claims." });

                var list = await _ideasService.GetPersonalIdeasForUserAsync(userId);
                return Ok(list);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch personal ideas.", detail = ex.Message });
            }
        }
    }
}
