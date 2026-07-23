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
  public class PortfoliosController : ControllerBase
  {
    private readonly AppDbContext _context;

    public PortfoliosController(AppDbContext context)
    {
      _context = context;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetPortfolios()
    {
      var portfolios = await _context.Portfolios
          .Where(p => p.UserId == CurrentUserId)
          .ToListAsync();

      return Ok(portfolios);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePortfolio(Portfolio portfolio)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      portfolio.UserId = CurrentUserId;
      _context.Portfolios.Add(portfolio);
      await _context.SaveChangesAsync();
      return Ok(portfolio);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePortfolio(int id, Portfolio updated)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var portfolio = await _context.Portfolios
          .FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);

      if (portfolio == null)
      {
        return NotFound();
      }

      portfolio.HeroTitle = updated.HeroTitle;
      portfolio.HeroTagline = updated.HeroTagline;
      portfolio.About = updated.About;
      portfolio.Skills = updated.Skills;
      portfolio.Projects = updated.Projects;
      portfolio.ContactEmail = updated.ContactEmail;
      portfolio.ContactPhone = updated.ContactPhone;

      await _context.SaveChangesAsync();
      return Ok(portfolio);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePortfolio(int id)
    {
      var portfolio = await _context.Portfolios
          .FirstOrDefaultAsync(p => p.Id == id && p.UserId == CurrentUserId);

      if (portfolio == null)
      {
        return NotFound();
      }

      _context.Portfolios.Remove(portfolio);
      await _context.SaveChangesAsync();
      return NoContent();
    }
  }
}
