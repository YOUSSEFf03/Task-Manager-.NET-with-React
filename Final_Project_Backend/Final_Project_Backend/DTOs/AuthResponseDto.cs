using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class AuthResponseDto
    {
        public int UserId { get; set; }

        // Make these properties nullable if they can be null
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
    }
}
