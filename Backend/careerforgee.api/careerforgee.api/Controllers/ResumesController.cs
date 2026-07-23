using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CareerForge.API.Data;
using CareerForge.API.Models;

namespace CareerForge.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class ResumesController : ControllerBase
  {
    private readonly AppDbContext _context;

    public ResumesController(AppDbContext context)
    {
      _context = context;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetResumes()
    {
      var resumes = await _context.Resumes
          .Where(r => r.UserId == CurrentUserId)
          .ToListAsync();

      return Ok(resumes);
    }

    [HttpPost]
    public async Task<IActionResult> CreateResume(Resume resume)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      resume.UserId = CurrentUserId;
      _context.Resumes.Add(resume);
      await _context.SaveChangesAsync();
      return Ok(resume);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateResume(int id, Resume updated)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var resume = await _context.Resumes
          .FirstOrDefaultAsync(r => r.Id == id && r.UserId == CurrentUserId);

      if (resume == null)
      {
        return NotFound();
      }

      resume.FullName = updated.FullName;
      resume.Email = updated.Email;
      resume.Phone = updated.Phone;
      resume.GitHub = updated.GitHub;
      resume.LinkedIn = updated.LinkedIn;
      resume.Education = updated.Education;
      resume.Experience = updated.Experience;
      resume.Skills = updated.Skills;
      resume.Projects = updated.Projects;
      resume.Certificates = updated.Certificates;
      resume.Languages = updated.Languages;
      resume.TemplateId = updated.TemplateId;

      await _context.SaveChangesAsync();
      return Ok(resume);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteResume(int id)
    {
      var resume = await _context.Resumes
          .FirstOrDefaultAsync(r => r.Id == id && r.UserId == CurrentUserId);

      if (resume == null)
      {
        return NotFound();
      }

      _context.Resumes.Remove(resume);
      await _context.SaveChangesAsync();
      return NoContent();
    }
  }
}
