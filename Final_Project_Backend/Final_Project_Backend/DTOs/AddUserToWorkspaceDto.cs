using Final_Project_Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class AddUserToWorkspaceDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public WorkspaceRole Role { get; set; } = WorkspaceRole.Member;

        // Optional: Add constructor if needed
        public AddUserToWorkspaceDto(string email, WorkspaceRole role)
        {
            Email = email;
            Role = role;
        }
        
        // Parameterless constructor for model binding
        public AddUserToWorkspaceDto() {}
    }
}