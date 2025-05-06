using Final_Project_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Final_Project_Backend.Data; 

namespace Final_Project_Backend.Services
{
   public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async System.Threading.Tasks.Task<User?> AuthenticateUserAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user != null && user.PasswordHash == password) // ⚠️ Use proper hashing in real apps
            return user;

        return null;
    }

    public async Task<User> GetUserByIdAsync(int userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId) ?? throw new InvalidOperationException("User not found.");  // Adjust based on your User entity's key
    }

    public async System.Threading.Tasks.Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async System.Threading.Tasks.Task<string> GenerateTokenAsync(User user)
    {
        return await System.Threading.Tasks.Task.FromResult("dummy-jwt-token");
    }

    public async System.Threading.Tasks.Task<bool> InvalidateTokenAsync(string token)
    {
        return await System.Threading.Tasks.Task.FromResult(true); 
    }
}

}
