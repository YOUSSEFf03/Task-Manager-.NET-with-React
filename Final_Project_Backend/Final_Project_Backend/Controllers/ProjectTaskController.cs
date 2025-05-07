using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Final_Project_Backend.Services;
using Final_Project_Backend.DTOs;
using System.Security.Claims;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectTaskController : ControllerBase
{
    private readonly IProjectTaskService _projectTaskService;

    public ProjectTaskController(IProjectTaskService projectTaskService)
    {
        _projectTaskService = projectTaskService;
    }

    [HttpPost("workspaces/{workspaceId}")]
    public async Task<IActionResult> CreateProject(int workspaceId, [FromBody] ProjectCreateDto projectDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _projectTaskService.CreateProject(userId, workspaceId, projectDto);
        return Ok(result);
    }

    [HttpPost("{projectId}/tasks")]
    public async Task<IActionResult> CreateTask(int projectId, [FromBody] TaskCreateDto taskDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        if (!await _projectTaskService.HasProjectPermission(userId, projectId))
        {
            return Forbid();
        }


        var result = await _projectTaskService.CreateTask(userId, projectId, taskDto);
        return Ok(result);
    }

    [HttpPost("tasks/{taskId}/subtasks")]
    public async Task<IActionResult> CreateSubtask(int taskId, [FromBody] SubtaskCreateDto subtaskDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _projectTaskService.CreateSubtask(userId, taskId, subtaskDto);
        return Ok(result);
    }


    // [HttpGet("{workspaceId}/projects")]
    // public async Task<IActionResult> GetProjects(int workspaceId)
    // {
    //     var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //     if (userIdClaim == null)
    //     {
    //         return Unauthorized("User not authenticated");
    //     }
    //     var userId = int.Parse(userIdClaim);
    //     var result = await _projectTaskService.GetProjects(workspaceId, userId);
    //     return Ok(result);
    // }

    [HttpGet("workspaces/{workspaceId}")]
    public async Task<IActionResult> GetProjects(int workspaceId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }

        var userId = int.Parse(userIdClaim);
        var result = await _projectTaskService.GetProjects(workspaceId, userId);
        return Ok(result);
    }

    [HttpGet("{projectId}/tasks")]
    public async Task<IActionResult> GetTasks(int projectId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim);
        var result = await _projectTaskService.GetTasks(projectId, userId);
        return Ok(result);
    }

    [HttpGet("tasks/{parentTaskId}/subtasks")]
    public async Task<IActionResult> GetSubtasks(int parentTaskId)
    {

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim);
        var result = await _projectTaskService.GetSubtasks(parentTaskId, userId);
        return Ok(result);
    }


    [HttpPut("{projectId}")]
    [Authorize]
    public async Task<IActionResult> UpdateProject(int projectId, [FromBody] ProjectUpdateDto dto)
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaimValue);
        var result = await _projectTaskService.UpdateProject(userId, projectId, dto);
        return result != null ? Ok(result) : BadRequest("Update failed");
    }

    [HttpDelete("{projectId}")]
    [Authorize]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaimValue);
        var result = await _projectTaskService.DeleteProject(userId, projectId);
        return result ? NoContent() : BadRequest("Delete failed");
    }

    [HttpPut("tasks/{taskId}")]
    [Authorize]
    public async Task<IActionResult> UpdateTask(int taskId, [FromBody] TaskUpdateDto dto)
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaimValue);
        var result = await _projectTaskService.UpdateTask(userId, taskId, dto);
        return result != null ? Ok(result) : BadRequest("Update failed");
    }

    [HttpDelete("tasks/{taskId}")]
    [Authorize]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var userIdClaimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaimValue))
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaimValue);
        var result = await _projectTaskService.DeleteTask(userId, taskId);
        return result ? NoContent() : BadRequest("Delete failed");
    }


    [HttpPost("tasks/{taskId}/comments")]
    public async Task<IActionResult> AddCommentToTask(int taskId, [FromBody] AddCommentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto?.Content))
        {
            return BadRequest("Content is required");
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        var comment = await _projectTaskService.AddCommentToTask(userId, taskId, dto.Content);
        return comment != null ? Ok(comment) : BadRequest("Failed to add comment");
    }

    [HttpPost("comments/{commentId}/mentions/{mentionedUserId}")]
    public async Task<IActionResult> MentionUserInComment(int commentId, int mentionedUserId)
    {
        var result = await _projectTaskService.MentionUserInComment(commentId, mentionedUserId);
        return result ? NoContent() : BadRequest("Failed to mention user");
    }

    [HttpGet("tasks/{taskId}/comments")]
    public async Task<IActionResult> GetCommentsByTask(int taskId)
    {
        var comments = await _projectTaskService.GetCommentsByTask(taskId);
        return Ok(comments);
    }




}




