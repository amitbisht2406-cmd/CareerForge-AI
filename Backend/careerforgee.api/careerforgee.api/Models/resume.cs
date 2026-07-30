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

        // FIX: same silent-drop bug as PhotoBase64 — the frontend has
        // a full Achievements add/remove UI and sends this field on
        // save, but there was no matching column here, so it was
        // never persisted.
        public string Achievements { get; set; } = "[]";

        public int TemplateId { get; set; } = 1;

        // FIX: this field was missing — the frontend already sends
        // photoBase64 for the resume photo upload feature, but with
        // no matching column here it was being silently dropped and
        // never saved. Base64 images can be large, so this is
        // unbounded on purpose (no [MaxLength]); the frontend already
        // enforces a 1MB upload limit before encoding.
        public string PhotoBase64 { get; set; } = string.Empty;
    }
}
