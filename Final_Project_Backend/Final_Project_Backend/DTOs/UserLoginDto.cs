using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class UserLoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    // You can add a constructor for initialization if needed
    public UserLoginDto(string email, string password)
    {
        Email = email;
        Password = password;
    }
}

}