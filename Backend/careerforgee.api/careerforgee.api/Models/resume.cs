using System.ComponentModel.DataAnnotations;

namespace CareerForge.API.Models
{
    public class Resume
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(255)]
        public string GitHub { get; set; } = string.Empty;

        [MaxLength(255)]
        public string LinkedIn { get; set; } = string.Empty;

        [Required]
        public string Education { get; set; } = string.Empty;

        [Required]
        [MinLength(20)]
        public string Experience { get; set; } = string.Empty;

        public string Skills { get; set; } = "[]";

        public string Projects { get; set; } = "[]";

        public string Certificates { get; set; } = "[]";

        public string Languages { get; set; } = "[]";

        public int TemplateId { get; set; } = 1;
    }
}