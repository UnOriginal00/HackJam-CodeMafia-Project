using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models.DTOs;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly GroupsService _groupsService;

        public GroupsController(GroupsService groupsService)
        {
            _groupsService = groupsService;
        }

        // POST /api/groups
        // Create a new group. The creator will be added to user_groups automatically.
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] GroupCreateRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var created = await _groupsService.CreateGroupAsync(request);
                return CreatedAtAction(nameof(GetGroup), new { groupId = created.GroupId }, created);
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
                return StatusCode(500, new { message = "Failed to create group.", detail = ex.Message });
            }
        }

        // POST /api/groups/join
        [HttpPost("join")]
        public async Task<IActionResult> JoinGroup([FromBody] JoinGroupRequest request)
        {
            try
            {
                await _groupsService.JoinGroupAsync(request);
                return Ok(new { message = "Joined group." });
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
                return StatusCode(500, new { message = "Failed to join group.", detail = ex.Message });
            }
        }

        // PUT /api/groups/{groupId}/rename
        [HttpPut("{groupId}/rename")]
        public async Task<IActionResult> RenameGroup(int groupId, [FromBody] RenameGroupRequest request)
        {
            if (groupId != request.GroupID) return BadRequest(new { message = "groupId mismatch." });

            try
            {
                await _groupsService.RenameGroupAsync(request);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE /api/groups/{groupId}
        [HttpDelete("{groupId}")]
        public async Task<IActionResult> DeleteGroup(int groupId, [FromBody] DeleteGroupRequest request)
        {
            if (groupId != request.GroupID) return BadRequest(new { message = "groupId mismatch." });

            try
            {
                await _groupsService.DeleteGroupAsync(request);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET /api/groups/{groupId}
        [HttpGet("{groupId}")]
        public async Task<IActionResult> GetGroup(int groupId)
        {
            var group = await _groupsService.GetGroupByIdAsync(groupId);
            if (group == null) return NotFound(new { message = "Group not found." });
            return Ok(group);
        }
    }
}