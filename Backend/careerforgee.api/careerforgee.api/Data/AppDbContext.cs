using Microsoft.EntityFrameworkCore;
using CareerForge.API.Models;

namespace CareerForge.API.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Resume> Resumes { get; set; }
    public DbSet<Portfolio> Portfolios { get; set; }
  }
}
