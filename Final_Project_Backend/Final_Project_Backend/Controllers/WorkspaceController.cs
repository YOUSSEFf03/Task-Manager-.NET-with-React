using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Final_Project_Backend.Services;
using Final_Project_Backend.DTOs;
using System.Security.Claims;

[ApiController]
[Route("api/workspaces")]
[Authorize]
public class WorkspaceController : ControllerBase
{
    private readonly IWorkspaceService _workspaceService;

    public WorkspaceController(IWorkspaceService workspaceService)
    {
        _workspaceService = workspaceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkspaces()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var workspaces = await _workspaceService.GetWorkspacesByUser(userId);
        return Ok(workspaces);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkspace([FromBody] WorkspaceCreateDto workspaceDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _workspaceService.CreateWorkspace(userId, workspaceDto);
        return Ok(result);
    }

    [HttpPost("{workspaceId}/users")]
    public async Task<IActionResult> AddUserToWorkspace(int workspaceId, [FromBody] AddUserToWorkspaceDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _workspaceService.AddUserToWorkspace(userId, workspaceId, dto);
        return Ok(result);
    }

    [HttpGet("{workspaceId}/users")]
    public async Task<IActionResult> GetWorkspaceUsers(int workspaceId)
    {
        var users = await _workspaceService.GetWorkspaceUsers(workspaceId);
        return Ok(users);
    }
}
