using Microsoft.AspNetCore.Mvc;
using Final_Project_Backend.Models;
using Final_Project_Backend.Services;
using Final_Project_Backend.DTOs;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] UserSignUpDto userDto)
    {
        var result = await _authService.SignUp(userDto);
        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        var result = await _authService.Login(loginDto);
        if (!result.Success)
            return Unauthorized(result.Message);

        return Ok(new
        {
            token = result.Token,
            fullName = result.FullName
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {

        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();


        if (string.IsNullOrEmpty(token))
        {
            return Unauthorized("Token is missing or invalid.");
        }

        var result = await _authService.Logout(token);
        return Ok(result);
    }
}
