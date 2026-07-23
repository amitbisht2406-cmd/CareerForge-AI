using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CareerForge.API.Data;

namespace CareerForge.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class UsersController : ControllerBase
  {
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
      _context = context;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public class UpdateProfileDto
    {
      public string FullName { get; set; } = string.Empty;
      public string Email { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
      public string CurrentPassword { get; set; } = string.Empty;
      public string NewPassword { get; set; } = string.Empty;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
      var user = await _context.Users.FindAsync(CurrentUserId);

      if (user == null)
      {
        return NotFound();
      }

      return Ok(new { user.FullName, user.Email });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
    {
      var user = await _context.Users.FindAsync(CurrentUserId);

      if (user == null)
      {
        return NotFound();
      }

      user.FullName = dto.FullName;
      user.Email = dto.Email;

      await _context.SaveChangesAsync();

      return Ok(new { message = "Profile updated successfully" });
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
      var user = await _context.Users.FindAsync(CurrentUserId);

      if (user == null)
      {
        return NotFound();
      }

      if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
      {
        return BadRequest("Current password is incorrect.");
      }

      user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
      await _context.SaveChangesAsync();

      return Ok(new { message = "Password changed successfully" });
    }
  }
}
