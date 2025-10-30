using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using backend.Models.DTOs;
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
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            try
            {
                var created = await _groupsService.CreateGroupAsync(request);
                return CreatedAtAction(nameof(GetGroup), new { groupId = created.GroupId }, created);
            }
            catch (ArgumentException ex)
            {
                // map duplicate-name argument to 409 Conflict, other argument issues -> 400
                if (ex.Message.Contains("already exists"))
                    return Conflict(new { message = ex.Message });
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // keep DB detail while debugging, remove in production
                return StatusCode(500, new { message = "Failed to create group.", detail = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create group.", detail = ex.Message });
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