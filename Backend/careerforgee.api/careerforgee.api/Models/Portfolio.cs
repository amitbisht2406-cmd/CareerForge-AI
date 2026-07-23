using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.Models
{
  public class Portfolio
  {
    public int Id { get; set; }
    public int UserId { get; set; }

    [Required, MaxLength(150)]
    public string HeroTitle { get; set; } = string.Empty;

    [MaxLength(200)]
    public string HeroTagline { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string About { get; set; } = string.Empty;

    public string Skills { get; set; } = "[]";
    public string Projects { get; set; } = "[]";

    [EmailAddress, MaxLength(100)]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(20)]
    public string ContactPhone { get; set; } = string.Empty;
  }
}
