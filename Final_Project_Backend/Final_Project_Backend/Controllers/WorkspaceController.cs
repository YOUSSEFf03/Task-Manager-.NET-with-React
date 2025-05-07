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

        var workspaces = await _workspaceService.GetWorkspaceDtosByUser(userId);

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
    public async Task<IActionResult> GetUserWorkspaces(int workspaceId)
    {
        var users = await _workspaceService.GetUserWorkspaces(workspaceId);
        return Ok(users);
    }



    [HttpDelete("{workspaceId}/users/{userIdToRemove}")]
// [Authorize]
public async Task<IActionResult> RemoveUserFromWorkspace(int workspaceId, int userIdToRemove)
{
    var nameIdentifierValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(nameIdentifierValue))
    {
        return Unauthorized("User not authenticated");
    }
    var currentUserId = int.Parse(nameIdentifierValue);
    var result = await _workspaceService.RemoveUserFromWorkspace(currentUserId, workspaceId, userIdToRemove);
    return result ? NoContent() : BadRequest("Failed to remove user");
}





[HttpPut("{workspaceId}")]
[Authorize]
public async Task<IActionResult> UpdateWorkspace(int workspaceId, [FromBody] WorkspaceUpdateDto dto)
{
    var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaimValue))
    {
        return Unauthorized("User not authenticated");
    }
    var userId = int.Parse(userIdClaimValue);
    var result = await _workspaceService.UpdateWorkspace(userId, workspaceId, dto);
    return result != null ? Ok(result) : BadRequest("Update failed");
}

[HttpDelete("{workspaceId}")]
[Authorize]
public async Task<IActionResult> DeleteWorkspace(int workspaceId)
{
    var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaimValue))
    {
        return Unauthorized("User not authenticated");
    }
    var userId = int.Parse(userIdClaimValue);
    var result = await _workspaceService.DeleteWorkspace(userId, workspaceId);
    return result ? NoContent() : BadRequest("Delete failed");
}

[HttpGet("count-by-role")]
public async Task<IActionResult> CountWorkspacesByRole()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null)
    {
        return Unauthorized("User not authenticated");
    }
    var userId = int.Parse(userIdClaim.Value);

    var roleCounts = await _workspaceService.CountWorkspacesByRole(userId);
    return Ok(roleCounts);
}

}
