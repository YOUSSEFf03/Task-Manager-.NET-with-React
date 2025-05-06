using Final_Project_Backend.DTOs;
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface IAuthService
    {
        Task<dynamic> SignUp(UserSignUpDto userDto);
        Task<AuthResult> Login(UserLoginDto loginDto);
        // Task<dynamic> Login(UserLoginDto loginDto);
        Task<dynamic> Logout(string token);
    }
}