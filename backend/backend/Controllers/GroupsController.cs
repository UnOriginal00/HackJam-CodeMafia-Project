using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models.DTOs;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        // NEW: GET /api/groups/user/{userId} - returns user's groups (quick-view up to MaxGroupsPerUser)
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetGroupsForUser(int userId)
        {
            try
            {
                var list = await _groupsService.GetGroupsForUserAsync(userId);
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
                return StatusCode(500, new { message = "Failed to fetch groups.", detail = ex.Message });
            }
        }

        // NEW: GET /api/groups/me - returns groups for the authenticated user (requires Authorization)
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyGroups()
        {
            try
            {
                // try typical claim types for user id
                var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid") ?? User.FindFirst("sub");
                if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });

                if (!int.TryParse(idClaim.Value, out var userId))
                    return BadRequest(new { message = "Invalid user id in claims." });

                var list = await _groupsService.GetGroupsForUserAsync(userId);
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
                return StatusCode(500, new { message = "Failed to fetch groups.", detail = ex.Message });
            }
        }

        // GET /api/groups/{groupId}/members
        [HttpGet("{groupId}/members")]
        public async Task<IActionResult> GetGroupMembers(int groupId)
        {
            if (groupId <= 0) return BadRequest(new { message = "Invalid groupId" });

            try
            {
                var members = await _groupsService.GetGroupMembersAsync(groupId);
                return Ok(members);
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
                return StatusCode(500, new { message = "Failed to fetch members.", detail = ex.Message });
            }
        }

        // ADDITIONAL ENDPOINTS

        // POST /api/groups/{groupId}/invite
        [Authorize]
        [HttpPost("{groupId}/invite")]
        public async Task<IActionResult> InviteToGroup(int groupId, [FromBody] SendInviteRequest request)
        {
            if (request == null) return BadRequest(new { message = "Request body required." });
            // ensure path and body groupId align
            if (groupId != request.GroupId) return BadRequest(new { message = "groupId mismatch." });

            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });
            if (!int.TryParse(idClaim.Value, out var senderUserId)) return BadRequest(new { message = "Invalid user id in claims." });

            try
            {
                var invite = await _groupsService.SendInviteAsync(request, senderUserId);
                return CreatedAtAction(null, new { inviteId = invite.InviteId }, invite);
            }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
            catch (UnauthorizedAccessException ex) { return StatusCode(403, new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return NotFound(new { message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { message = "Failed to send invite.", detail = ex.Message }); }
        }

        // GET /api/groups/invites/me
        [Authorize]
        [HttpGet("invites/me")]
        public async Task<IActionResult> GetMyInvites()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });
            if (!int.TryParse(idClaim.Value, out var userId)) return BadRequest(new { message = "Invalid user id in claims." });

            try
            {
                var invites = await _groupsService.GetInvitesForUserAsync(userId);
                return Ok(invites);
            }
            catch (Exception ex) { return StatusCode(500, new { message = "Failed to fetch invites.", detail = ex.Message }); }
        }

        // POST /api/groups/invites/{inviteId}/accept
        [Authorize]
        [HttpPost("invites/{inviteId}/accept")]
        public async Task<IActionResult> AcceptInvite(int inviteId)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });
            if (!int.TryParse(idClaim.Value, out var userId)) return BadRequest(new { message = "Invalid user id in claims." });

            try
            {
                await _groupsService.AcceptInviteAsync(inviteId, userId);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex) { return StatusCode(403, new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return NotFound(new { message = ex.Message }); }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { message = "Failed to accept invite.", detail = ex.Message }); }
        }

        // POST /api/groups/invites/{inviteId}/decline
        [Authorize]
        [HttpPost("invites/{inviteId}/decline")]
        public async Task<IActionResult> DeclineInvite(int inviteId)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });
            if (!int.TryParse(idClaim.Value, out var userId)) return BadRequest(new { message = "Invalid user id in claims." });

            try
            {
                await _groupsService.DeclineInviteAsync(inviteId, userId);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex) { return StatusCode(403, new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return NotFound(new { message = ex.Message }); }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { message = "Failed to decline invite.", detail = ex.Message }); }
        }
    }
}