using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CareerForge.API.Services;

namespace CareerForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AiController : ControllerBase
    {
        private readonly GroqService _groqService;
        private readonly ILogger<AiController> _logger;

        public AiController(
            GroqService groqService,
            ILogger<AiController> logger)
        {
            _groqService = groqService;
            _logger = logger;
        }

        public class ReviewRequest
        {
            public string ResumeText { get; set; } = string.Empty;
        }

        [HttpPost("review-resume")]
        public async Task<IActionResult> ReviewResume(ReviewRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ResumeText))
            {
                return BadRequest("Resume text is required.");
            }

            try
            {
                var rawJson =
                    await _groqService.ReviewResumeAsync(request.ResumeText);

                var cleaned = rawJson.Trim();

                // Safety cleanup in case model returns code fences
                if (cleaned.StartsWith("```"))
                {
                    cleaned = cleaned
                        .Replace("```json", "")
                        .Replace("```", "")
                        .Trim();
                }

                return Content(cleaned, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "AI resume review failed using Groq"
                );

                return StatusCode(
                    500,
                    new
                    {
                        message = "AI review is temporarily unavailable. Please try again."
                    }
                );
            }
        }
    }
}