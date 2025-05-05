using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class UserSignUpDto
{
    [Required, MaxLength(100)]
    public string FullName { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; }

    [Required, MinLength(6)]
    public string Password { get; set; }

    // Constructor to ensure properties are initialized
    public UserSignUpDto(string fullName, string email, string password)
    {
        FullName = fullName;
        Email = email;
        Password = password;
    }
}

}