using backend.Services;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // GET /api/dashboard/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyDashboard()
        {
            // extract user id from JWT claims
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid") ?? User.FindFirst("sub");
            if (idClaim == null) return Unauthorized(new { message = "User id claim missing." });

            if (!int.TryParse(idClaim.Value, out var userId))
                return BadRequest(new { message = "Invalid user id in claims." });

            try
            {
                var dto = await _dashboardService.GetDashboardForUserAsync(userId);
                return Ok(dto);
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (System.InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch dashboard.", detail = ex.Message });
            }
        }
    }
}