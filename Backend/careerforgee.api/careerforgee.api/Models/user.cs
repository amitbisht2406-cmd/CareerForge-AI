namespace CareerForge.API.Models
{
  public class User
  {
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Nullable now: users who sign up via Google never set a password.
    public string? PasswordHash { get; set; }

    // Google's stable "sub" claim for the account. Null for
    // users who registered with email/password only.
    public string? GoogleId { get; set; }
  }
}
