using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CareerForge.API.Services
{
    public class GroqService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GroqService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;

            _apiKey = config["Groq:ApiKey"]
                ?? throw new Exception("Groq API key not configured");
        }

        public async Task<string> ReviewResumeAsync(string resumeText)
        {
            var prompt = $@"
You are a professional resume reviewer.

Analyze the resume below and respond with ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not include any text outside the JSON.

Return exactly this structure:

{{
  ""overallScore"": 0,
  ""grammarScore"": 0,
  ""atsScore"": 0,
  ""skillsScore"": 0,
  ""feedback"": ""2-3 sentence summary of strengths and weaknesses"",
  ""missingSkillsSuggestion"": ""1 sentence suggesting useful skills to add""
}}

All scores must be integers between 0 and 100.

Resume:
{resumeText}
";

            var requestBody = new
            {
                model = "llama-3.3-70b-versatile",

                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },

                temperature = 0.3
            };

            var json = JsonSerializer.Serialize(requestBody);

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.groq.com/openai/v1/chat/completions"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            request.Content =
                new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            var responseBody =
                await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(
                    $"Groq API error ({(int)response.StatusCode}): {responseBody}"
                );
            }

            using var doc = JsonDocument.Parse(responseBody);

            if (!doc.RootElement.TryGetProperty("choices", out var choices) ||
                choices.GetArrayLength() == 0)
            {
                throw new Exception("Groq returned no choices in the response.");
            }

            var content = choices[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new Exception("Groq returned an empty response.");
            }

            return content;
        }
    }
}