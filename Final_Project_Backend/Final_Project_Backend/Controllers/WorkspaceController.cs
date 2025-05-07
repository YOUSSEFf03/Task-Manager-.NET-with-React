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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        Console.WriteLine($"User ID Claim: {userIdClaim}");
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);
        Console.WriteLine($"User ID: {userId}");

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

    [HttpPost("{workspaceId}/tags")]
    public async Task<IActionResult> CreateTag(int workspaceId, [FromBody] CreateTagDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _workspaceService.CreateTag(userId, workspaceId, dto);
        return result != null ? Ok(result) : BadRequest("Failed to create tag");
    }

    [HttpPost("tasks/{taskId}/tags/{tagId}")]
    public async Task<IActionResult> AssignTagToTask(int taskId, int tagId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        // Ensure the user has access to the workspace via _workspaceService.GetUserWorkspaces
        var hasAccess = await _workspaceService.HasAccessToTaskWorkspace(userId, taskId);
        if (!hasAccess)
        {
            return Forbid("User does not have access to the workspace");
        }

        var result = await _workspaceService.AssignTagToTask(userId, taskId, tagId);
        return result ? NoContent() : BadRequest("Failed to assign tag to task");
    }

    [HttpPost("tasks/{taskId}/comments")]
    public async Task<IActionResult> AddCommentToTask(int taskId, [FromBody] AddCommentDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest(new { error = "The content field is required." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var comment = await _workspaceService.AddCommentToTask(userId, taskId, dto.Content);
        return comment != null ? Ok(comment) : BadRequest("Failed to add comment");
    }

    [HttpPost("comments/{commentId}/mentions")]
    public async Task<IActionResult> MentionUserInComment(int commentId, [FromBody] MentionUserDto dto)
    {
        if (dto == null || dto.MentionedUserId <= 0)
        {
            return BadRequest(new { error = "Invalid mentionedUserId." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }

        var result = await _workspaceService.MentionUserInComment(commentId, dto.MentionedUserId);
        return result ? NoContent() : BadRequest("Failed to mention user");
    }

    [HttpGet("projects/{projectId}/comments")]


    [HttpGet("tasks/{taskId}/comments")]
    public async Task<IActionResult> GetCommentsByTask(int taskId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        // Ensure the user has access to the task
        var comments = await _workspaceService.GetCommentsByTask(taskId);
        return Ok(comments);
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
