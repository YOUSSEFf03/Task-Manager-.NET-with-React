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

  [Authorize]
[HttpGet]
public async Task<IActionResult> GetWorkspaces()
{
    try
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }
        
        var userId = int.Parse(userIdClaim.Value);
        var workspaces = await _workspaceService.GetWorkspaceDtosByUser(userId);
        return Ok(workspaces);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error getting workspaces: {ex.Message}");
        return StatusCode(500, new { error = "Internal server error" });
    }
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
        return Unauthorized(new { error = "User not authenticated" });
    }
    var userId = int.Parse(userIdClaim.Value);

    try
    {
        var result = await _workspaceService.AddUserToWorkspace(userId, workspaceId, dto);
        return result ? Ok(new { success = true }) : StatusCode(StatusCodes.Status403Forbidden, new { error = "Failed to add user" });
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
    }
}

[HttpGet("{workspaceId}/users")]
public async Task<IActionResult> GetUserWorkspaces(int workspaceId)
{
    try
    {
        var usersWithRoles = await _workspaceService.GetUserWorkspaces(workspaceId);
        return Ok(usersWithRoles);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error getting workspace users: {ex.Message}");
        return StatusCode(500, new { error = "Failed to retrieve workspace users" });
    }
}

    [HttpDelete("{workspaceId}/users/{userIdToRemove}")]
public async Task<IActionResult> RemoveUserFromWorkspace(int workspaceId, int userIdToRemove)
{
    try
    {
        var nameIdentifierValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(nameIdentifierValue))
        {
            return Unauthorized(new { error = "User not authenticated" });
        }
        
        var currentUserId = int.Parse(nameIdentifierValue);
        var result = await _workspaceService.RemoveUserFromWorkspace(currentUserId, workspaceId, userIdToRemove);
        
        return result ? NoContent() 
            : StatusCode(403, new { error = "Failed to remove user - check permissions" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error removing user: {ex.Message}");
        return StatusCode(500, new { error = "Failed to remove user" });
    }
}

    [HttpPut("{workspaceId}")]
    [Authorize]
public async Task<IActionResult> UpdateWorkspace(int workspaceId, [FromBody] WorkspaceUpdateDto dto)
{
    try
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized(new { error = "User not authenticated" });
        }
        
        var userId = int.Parse(userIdClaimValue);
        var result = await _workspaceService.UpdateWorkspace(userId, workspaceId, dto);
        
        return result != null ? Ok(result) 
            : StatusCode(403, new { error = "Update failed - check permissions" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error updating workspace: {ex.Message}");
        return StatusCode(500, new { error = "Failed to update workspace" });
    }
}

[HttpDelete("{workspaceId}")]
[Authorize]
public async Task<IActionResult> DeleteWorkspace(int workspaceId)
{
    try
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized(new { error = "User not authenticated" });
        }
        
        var userId = int.Parse(userIdClaimValue);
        var result = await _workspaceService.DeleteWorkspace(userId, workspaceId);
        
        return result ? NoContent() 
            : StatusCode(403, new { error = "Delete failed - check permissions" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error deleting workspace: {ex.Message}");
        return StatusCode(500, new { error = "Failed to delete workspace" });
    }
}

[HttpGet("count-by-role")]
public async Task<IActionResult> CountWorkspacesByRole()
{
    try
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }
        
        var userId = int.Parse(userIdClaim.Value);
        var roleCounts = await _workspaceService.CountWorkspacesByRole(userId);
        return Ok(roleCounts);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error counting workspaces by role: {ex.Message}");
        return StatusCode(500, new { error = "Failed to count workspaces by role" });
    }
}

 
[HttpPost("{workspaceId}/tags")]
public async Task<IActionResult> CreateTag(int workspaceId, [FromBody] CreateTagDto dto)
{
    var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaimValue))
    {
        return Unauthorized(new { error = "User not authenticated" });
    }
    var userId = int.Parse(userIdClaimValue);

    try
    {
        var tag = await _workspaceService.CreateTag(userId, workspaceId, dto);
        return tag != null ? Ok(tag) : StatusCode(StatusCodes.Status403Forbidden, new { error = "Tag creation failed" });
    }
    catch (UnauthorizedAccessException ex)
    {
        return StatusCode(StatusCodes.Status403Forbidden, new { error = ex.Message });
    }
    catch (Exception)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Failed to create tag" });
    }
}

[HttpPost("tasks/{taskId}/tags/{tagId}")]
public async Task<IActionResult> AssignTagToTask(int taskId, int tagId)
{
    var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdClaimValue))
    {
        return Unauthorized("User not authenticated");
    }
    var userId = int.Parse(userIdClaimValue);
    var success = await _workspaceService.AssignTagToTask(userId, taskId, tagId);
    return success ? NoContent() : Forbid(); // 403 if no permission
}


    [HttpGet("search-users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { error = "Query parameter is required." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }

        var users = await _workspaceService.SearchUsers(query);
        return Ok(users);
    }

    [Authorize]
    [HttpGet("{workspaceId}")]
    public async Task<IActionResult> GetWorkspace(int workspaceId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }

        var userId = int.Parse(userIdClaim.Value);

        try
        {
            var workspace = await _workspaceService.GetWorkspaceById(userId, workspaceId);

            if (workspace == null)
            {
                return NotFound("Workspace not found.");
            }

            return Ok(workspace);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving workspace: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }



    }


}
