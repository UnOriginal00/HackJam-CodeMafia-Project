using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AuthenticationService _authService;

        public AuthenticationController(AuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.SignupAsync(request);

            if (result == "User already exists.")
                return Conflict(new { message = result });

            return Ok(new { message = result });
        }

        // login now returns a JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] backend.Models.DTOs.LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _authService.LoginAsync(request); // returns User?
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // include basic profile fields in token creation and response
            var token = _authService.GenerateJwtToken(
                user.UserId,
                user.Email,
                user.UserDetail?.Name, // Changed from FullName to Name
                user.GroupId
            );

            var profile = new
            {
                user.UserId,
                user.Email,
                GroupId = user.GroupId,
                // adapt to whatever UserDetail properties you have:
                Name = user.UserDetail?.Name
            };

            return Ok(new { token, profile });
        }
    }
}
