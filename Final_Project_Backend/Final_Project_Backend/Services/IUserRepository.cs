using Final_Project_Backend.Models;

namespace Final_Project_Backend.Services
{
    // In IUserRepository.cs
public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> AuthenticateUserAsync(string email, string password);
    Task<User> CreateUserAsync(User user);
    Task<string> GenerateTokenAsync(User user);
    Task<bool> InvalidateTokenAsync(string token);

    Task<User> GetUserByIdAsync(int userId); 
}

}
