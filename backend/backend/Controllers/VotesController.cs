using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VotesController : ControllerBase
    {
        private readonly VotesService _votesService;

        public VotesController(VotesService votesService)
        {
            _votesService = votesService;
        }

        // POST /api/votes
        [HttpPost]
        public async Task<IActionResult> CastVote([FromBody] VoteRequest request)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            try
            {
                var result = await _votesService.CastVoteAsync(request);
                return Ok(result);
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
                return StatusCode(500, new { message = "Failed to cast vote.", detail = ex.Message });
            }
        }

        // GET /api/votes/idea/{ideaId}
        [HttpGet("idea/{ideaId}")]
        public async Task<IActionResult> GetCounts(int ideaId)
        {
            try
            {
                var counts = await _votesService.GetCountsAsync(ideaId);
                return Ok(counts);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
