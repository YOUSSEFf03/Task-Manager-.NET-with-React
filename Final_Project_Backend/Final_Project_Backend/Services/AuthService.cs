using Final_Project_Backend.DTOs;
using Final_Project_Backend.Models;
using System.Threading.Tasks;
using Final_Project_Backend.Services; 
using BCrypt.Net;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;




namespace Final_Project_Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;  // Assuming you have a _jwtSettings variable declared

        public AuthService(IUserRepository userRepository, IOptions<JwtSettings> jwtOptions)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<dynamic> SignUp(UserSignUpDto userDto)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                return new { Success = false, Message = "Email already in use." };
            }

            var user = new User
            {
                FullName = userDto.FullName,
                Email = userDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            var createdUser = await _userRepository.CreateUserAsync(user);

            return new { Success = true, Message = "User signed up successfully.", User = createdUser };
        }

        public async Task<dynamic> Login(UserLoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return new { Success = false, Message = "Invalid email or password." };
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return new { Success = false, Message = "Invalid email or password." };
            }

            var token = GenerateJwtToken(user);

            return new
            {
                Success = true,
                Message = "Login successful.",
                Token = token,
                User = user
            };
        }

        public async Task<dynamic> Logout(string token)
        {
            var result = await _userRepository.InvalidateTokenAsync(token);
            return new { Success = true, Message = "User logged out successfully." };
        }

       private string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

   
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}
