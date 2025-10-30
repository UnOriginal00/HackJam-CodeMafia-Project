using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Diagnostics;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _fastApiBaseUrl = "http://10.143.137.19";

        public AIController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("ping-ai")]
        public async Task<IActionResult> PingAiServer()
        {
            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                var sw = Stopwatch.StartNew();

                // Prefer a lightweight health endpoint if the AI server exposes one.
                // If not, you can target /user_query or /getfile with a safe method.
                var resp = await _httpClient.GetAsync($"{_fastApiBaseUrl}/health", cts.Token);
                sw.Stop();

                string body = string.Empty;
                try
                {
                    body = await resp.Content.ReadAsStringAsync(cts.Token);
                }
                catch { /* swallow read errors for diagnostics */ }

                return Ok(new
                {
                    reachable = resp.IsSuccessStatusCode,
                    statusCode = (int)resp.StatusCode,
                    elapsedMs = sw.ElapsedMilliseconds,
                    response = body
                });
            }
            catch (Exception ex)
            {
                return StatusCode(502, new { reachable = false, error = ex.Message });
            }
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessFileAndPrompt([FromForm] IFormFile file, [FromForm] string prompt)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                // STEP 1️⃣: Send the prompt as JSON
                var promptPayload = new { prompt = prompt };
                var promptContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(promptPayload), System.Text.Encoding.UTF8, "application/json");
                var promptResponse = await _httpClient.PostAsync($"{_fastApiBaseUrl}/user_query", promptContent);
                var promptResult = await promptResponse.Content.ReadAsStringAsync();

                // STEP 2️⃣: Send the file as multipart/form-data
                using var formData = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                var fileContent = new StreamContent(fileStream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                formData.Add(fileContent, "file", file.FileName);
                var fileResponse = await _httpClient.PostAsync($"{_fastApiBaseUrl}/getfile", formData);
                var fileResult = await fileResponse.Content.ReadAsStringAsync();

                // STEP 3️⃣: Combine results and return to frontend
                return Ok(new
                {
                    promptResponse = promptResult,
                    fileResponse = fileResult
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error communicating with AI server", error = ex.Message });
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadNote([FromBody] backend.Models.DTOs.NoteDto note)
        {
            // Save to DB or process as needed
            return Ok(new { message = "Note received successfully." });
        }
    }
}
