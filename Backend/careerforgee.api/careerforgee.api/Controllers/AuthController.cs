using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CareerForge.API.Data;
using CareerForge.API.Models;
using Google.Apis.Auth;

namespace CareerForge.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    public class RegisterDto
    {
      public string FullName { get; set; } = string.Empty;
      public string Email { get; set; } = string.Empty;
      public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
      public string Email { get; set; } = string.Empty;
      public string Password { get; set; } = string.Empty;
    }

    public class GoogleLoginDto
    {
      // The credential (ID token) returned by Google Identity
      // Services on the frontend.
      public string IdToken { get; set; } = string.Empty;
    }

    // ==========================================================
    // Shared helper: generate JWT for a given user
    // ==========================================================
    private string GenerateToken(User user)
    {
      var jwtKey = _configuration["Jwt:Key"]
          ?? throw new InvalidOperationException("Jwt:Key is not configured.");

      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.UTF8.GetBytes(jwtKey);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
        {
          new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
          new Claim(ClaimTypes.Email, user.Email)
        }),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(
              new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
      var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
      if (exists)
      {
        return BadRequest("Email already registered.");
      }

      var user = new User
      {
        FullName = dto.FullName,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
      };

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      // FIX: return a token immediately, same shape as Login,
      // so the frontend can log the user in and go straight to
      // the dashboard instead of bouncing to /login.
      var token = GenerateToken(user);

      return Ok(new
      {
        token,
        fullName = user.FullName,
        email = user.Email
      });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

      if (user == null)
      {
        return Unauthorized("Invalid email or password.");
      }

      // This account was created via Google and has no password set.
      // Verifying against a null hash would throw, so handle it
      // explicitly with a clear message instead.
      if (user.PasswordHash == null)
      {
        return Unauthorized("This account uses Google Sign-In. Please continue with Google, or set a password from your profile first.");
      }

      if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
      {
        return Unauthorized("Invalid email or password.");
      }

      var token = GenerateToken(user);

      return Ok(new
      {
        token,
        fullName = user.FullName,
        email = user.Email
      });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(GoogleLoginDto dto)
    {
      var googleClientId = _configuration["Google:ClientId"]
          ?? throw new InvalidOperationException("Google:ClientId is not configured.");

      GoogleJsonWebSignature.Payload payload;

      try
      {
        payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, new GoogleJsonWebSignature.ValidationSettings
        {
          Audience = new[] { googleClientId }
        });
      }
      catch (InvalidJwtException)
      {
        return Unauthorized("Invalid Google token.");
      }

      // Match on GoogleId first, then fall back to email so an
      // existing email/password account gets linked automatically.
      var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject)
          ?? await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

      if (user == null)
      {
        user = new User
        {
          FullName = payload.Name ?? payload.Email,
          Email = payload.Email,
          GoogleId = payload.Subject,
          PasswordHash = null
        };

        _context.Users.Add(user);
      }
      else if (user.GoogleId == null)
      {
        // Existing email/password account signing in with Google
        // for the first time - link it instead of duplicating.
        user.GoogleId = payload.Subject;
      }

      await _context.SaveChangesAsync();

      var token = GenerateToken(user);

      return Ok(new
      {
        token,
        fullName = user.FullName,
        email = user.Email
      });
    }
  }
}
