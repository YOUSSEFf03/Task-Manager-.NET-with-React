using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class AddUserToWorkspaceDto
{
    [Required, EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Role { get; set; } // "Admin", "Member", "Viewer"

    public AddUserToWorkspaceDto(string email, string role)
    {
        Email = email;
        Role = role;
    }
}

}