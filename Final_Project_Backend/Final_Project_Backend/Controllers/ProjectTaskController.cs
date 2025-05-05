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

    [HttpPost("{workspaceId}")]
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
}
