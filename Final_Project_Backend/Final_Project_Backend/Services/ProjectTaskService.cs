// ProjectTaskService.cs
using Final_Project_Backend.Data;
using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using TaskModel = Final_Project_Backend.Models.Task; // Alias to avoid ambiguity

namespace Final_Project_Backend.Services
{
    public class ProjectTaskService : IProjectTaskService
    {
        private readonly AppDbContext _context;
        private readonly IWorkspaceService _workspaceService;

        public ProjectTaskService(AppDbContext context, IWorkspaceService workspaceService)
        {
            _context = context;
            _workspaceService = workspaceService;
        }

        public async Task<Project> CreateProject(int userId, int workspaceId, ProjectCreateDto projectDto)
        {
            // Check if user has permission (must be admin or member)
            var userWorkspaces = await _workspaceService.GetUserWorkspaces(workspaceId);
            var user = userWorkspaces.FirstOrDefault(u => u.UserId == userId);
            
            if (user == null)
            {
                throw new UnauthorizedAccessException("User is not part of this workspace");
            }

             var project = new Project
    {
        WorkspaceId = workspaceId,
        Name = projectDto.Name ?? string.Empty, 
        Description = projectDto.Description ?? string.Empty, 
        Status = "Unstarted",
        CreatedByUserId = userId
    };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<TaskModel> CreateTask(int userId, int projectId, TaskCreateDto taskDto)
        {
            // Check if user has permission (must be admin or member)
            var project = await _context.Projects
                .Include(p => p.Workspace)
                .ThenInclude(w => w.UserWorkspaces)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                throw new KeyNotFoundException("Project not found");
            }

            var userRole = project.Workspace.UserWorkspaces
                .FirstOrDefault(wu => wu.UserId == userId)?.Role;

            if (userRole == null || userRole == WorkspaceRole.Viewer)
            {
                throw new UnauthorizedAccessException("User doesn't have permission to create tasks");
            }

            var task = new TaskModel
            {
                ProjectId = projectId,
                Priority = taskDto.Priority,
                Status = "ToDo",
                DueDate = taskDto.DueDate,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                AssignedToUserId = taskDto.AssignedToUserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return task;
        }

        public async Task<TaskModel> CreateSubtask(int userId, int taskId, SubtaskCreateDto subtaskDto)
        {
            // Check if parent task exists
            var parentTask = await _context.Tasks
                .Include(t => t.Project)
                .ThenInclude(p => p.Workspace)
                .ThenInclude(w => w.UserWorkspaces)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            if (parentTask == null)
            {
                throw new KeyNotFoundException("Parent task not found");
            }

            // Check if user has permission (must be admin or member)
            var userRole = parentTask.Project.Workspace.UserWorkspaces
                .FirstOrDefault(wu => wu.UserId == userId)?.Role;

            if (userRole == null || userRole == WorkspaceRole.Viewer)
            {
                throw new UnauthorizedAccessException("User doesn't have permission to create subtasks");
            }

            var subtask = new TaskModel
            {
                ProjectId = parentTask.ProjectId,
                Priority = subtaskDto.Priority,
                Status = "ToDo",
                DueDate = subtaskDto.DueDate,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                AssignedToUserId = subtaskDto.AssignedToUserId,
                ParentTaskId = taskId
            };

            _context.Tasks.Add(subtask);
            await _context.SaveChangesAsync();

            return subtask;
        }
    

   public async Task<IEnumerable<ProjectResponseDto>> GetProjects(int workspaceId, int userId)
        {


        var hasAccess = await _context.UserWorkspaces
        .AnyAsync(uw => uw.WorkspaceId == workspaceId && uw.UserId == userId);

    if (!hasAccess)
        throw new UnauthorizedAccessException("User not in workspace");


            return await _context.Projects
                .Where(p => p.WorkspaceId == workspaceId)
                .Include(p => p.Workspace)
                .Select(p => new ProjectResponseDto
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status,
                    WorkspaceId = p.WorkspaceId,
                    CreatedByUserId = p.CreatedByUserId
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasks(int projectId , int userId)
        {

    var project = await _context.Projects
        .Include(p => p.Workspace)
        .ThenInclude(w => w.UserWorkspaces)
        .FirstOrDefaultAsync(p => p.ProjectId == projectId);

    if (project?.Workspace.UserWorkspaces.All(uw => uw.UserId != userId) == true)
        throw new UnauthorizedAccessException("No access to project");

            return await _context.Tasks
                .Where(t => t.ProjectId == projectId && t.ParentTaskId == null) 
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    ProjectId = t.ProjectId,
                    Title = "", // Add this if needed in DTO
                    Description = "", // Add this if needed in DTO
                    Priority = t.Priority,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CreatedByUserId = t.CreatedByUserId,
                    AssignedToUserId = t.AssignedToUserId,
                    ParentTaskId = t.ParentTaskId
                })
                .ToListAsync();
        }

       
        public async Task<IEnumerable<TaskResponseDto>> GetSubtasks(int parentTaskId ,  int userId)
        {

           var parentTask = await _context.Tasks
        .Include(t => t.Project)
            .ThenInclude(p => p.Workspace)
                .ThenInclude(w => w.UserWorkspaces)
        .FirstOrDefaultAsync(t => t.TaskId == parentTaskId);

    if (parentTask == null)
    {
        throw new KeyNotFoundException("Parent task not found");
    }

    if (!parentTask.Project.Workspace.UserWorkspaces.Any(uw => uw.UserId == userId))
    {
        throw new UnauthorizedAccessException("User doesn't have access to this workspace");
    }

            return await _context.Tasks
                .Where(t => t.ParentTaskId == parentTaskId)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    ProjectId = t.ProjectId,
                    Title = "", // Add this if needed in DTO
                    Description = "", 
                    Priority = t.Priority,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CreatedByUserId = t.CreatedByUserId,
                    AssignedToUserId = t.AssignedToUserId,
                    ParentTaskId = t.ParentTaskId
                })
                .ToListAsync();
        }

}
}