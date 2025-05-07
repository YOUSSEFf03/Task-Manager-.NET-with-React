using Final_Project_Backend.Data;
using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            if (!await HasWorkspacePermission(userId, workspaceId))
                throw new UnauthorizedAccessException("User doesn't have permission");

            var project = new Project
            {
                WorkspaceId = workspaceId,
                Name = projectDto.Name ?? string.Empty,
                Description = projectDto.Description ?? string.Empty,
                Status = ProjectStatus.Unstarted,
                StartDate = projectDto.StartDate,
                Deadline = projectDto.Deadline,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<Final_Project_Backend.Models.Task> CreateTask(int userId, int projectId, TaskCreateDto taskDto)
        {
            if (!await HasProjectPermission(userId, projectId))
                throw new UnauthorizedAccessException("User doesn't have permission");

            // Validate assigned user
            if (taskDto.AssignedToUserId.HasValue && 
                !await _context.UserWorkspaces.AnyAsync(uw => 
                    uw.UserId == taskDto.AssignedToUserId.Value && 
                    uw.WorkspaceId == _context.Projects
                        .Where(p => p.ProjectId == projectId)
                        .Select(p => p.WorkspaceId)
                        .FirstOrDefault()))
            {
                throw new KeyNotFoundException("Assigned user not in workspace");
            }

            var task = new Final_Project_Backend.Models.Task
            {
                ProjectId = projectId,
                Title = taskDto.Title,
                Description = taskDto.Description,
                Priority = Enum.Parse<TaskPriority>(taskDto.Priority),
                Status = Final_Project_Backend.Models.TaskStatus.ToDo,
                DueDate = taskDto.DueDate,
                CreatedAt = DateTime.UtcNow,
                CreatedByUserId = userId,
                AssignedToUserId = taskDto.AssignedToUserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<Final_Project_Backend.Models.Task> CreateSubtask(int userId, int taskId, SubtaskCreateDto subtaskDto)
        {
            var parentTask = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            if (parentTask == null)
                throw new KeyNotFoundException("Parent task not found");

            return await CreateTask(userId, parentTask.ProjectId, new TaskCreateDto
            {
                Title = subtaskDto.Title,
                Description = subtaskDto.Description,
                Priority = subtaskDto.Priority,
                DueDate = subtaskDto.DueDate,
                AssignedToUserId = subtaskDto.AssignedToUserId
            });
        }

        public async Task<IEnumerable<ProjectResponseDto>> GetProjects(int workspaceId, int userId)
        {
            if (!await HasWorkspacePermission(userId, workspaceId, true))
                throw new UnauthorizedAccessException("No access to workspace");

            return await _context.Projects
                .Where(p => p.WorkspaceId == workspaceId)
                .Select(p => new ProjectResponseDto
                {
                    ProjectId = p.ProjectId,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status.ToString(),
                    WorkspaceId = p.WorkspaceId,
                    CreatedByUserId = p.CreatedByUserId,
                    // StartDate = p.StartDate,
                    // Deadline = p.Deadline
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasks(int projectId, int userId)
        {
            if (!await HasProjectPermission(userId, projectId, true))
                throw new UnauthorizedAccessException("No access to project");

            return await _context.Tasks
                .Where(t => t.ProjectId == projectId && t.ParentTaskId == null)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    ProjectId = t.ProjectId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority.ToString(),
                    Status = t.Status.ToString(),
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CreatedByUserId = t.CreatedByUserId,
                    AssignedToUserId = t.AssignedToUserId,
                    ParentTaskId = t.ParentTaskId
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskResponseDto>> GetSubtasks(int parentTaskId, int userId)
        {
            var parentTask = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == parentTaskId);

            if (parentTask == null || !await HasProjectPermission(userId, parentTask.ProjectId, true))
                throw new UnauthorizedAccessException("No access to task");

            return await _context.Tasks
                .Where(t => t.ParentTaskId == parentTaskId)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    ProjectId = t.ProjectId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority.ToString(),
                    Status = t.Status.ToString(),
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CreatedByUserId = t.CreatedByUserId,
                    AssignedToUserId = t.AssignedToUserId,
                    ParentTaskId = t.ParentTaskId
                })
                .ToListAsync();
        }

        public async Task<Project?> UpdateProject(int userId, int projectId, ProjectUpdateDto dto)
        {
            var project = await _context.Projects
                .Include(p => p.Workspace)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null || !await HasProjectPermission(userId, projectId))
                return null;

            project.Name = dto.Name ?? project.Name;
            project.Description = dto.Description ?? project.Description;
            
            if (dto.Status != null && Enum.TryParse(dto.Status, out ProjectStatus status))
                project.Status = status;

            // if (dto.StartDate.HasValue)
            //     project.StartDate = dto.StartDate.Value;

            // if (dto.Deadline.HasValue)
            //     project.Deadline = dto.Deadline.Value;

            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<bool> DeleteProject(int userId, int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null || !await HasProjectPermission(userId, projectId))
                return false;

            // Soft delete by changing status
            project.Status = ProjectStatus.Removed;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Final_Project_Backend.Models.Task?> UpdateTask(int userId, int taskId, TaskUpdateDto dto)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            if (task == null || !await HasProjectPermission(userId, task.ProjectId))
                return null;

            if (dto.Title != null) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (dto.Priority != null) task.Priority = Enum.Parse<TaskPriority>(dto.Priority);
            if (dto.Status != null) task.Status = Enum.Parse<Final_Project_Backend.Models.TaskStatus>(dto.Status);
            if (dto.DueDate != null) task.DueDate = dto.DueDate;

            if (dto.AssignedToUserId.HasValue)
            {
                if (await _context.UserWorkspaces.AnyAsync(uw => 
                    uw.UserId == dto.AssignedToUserId.Value && 
                    uw.WorkspaceId == task.Project.WorkspaceId))
                {
                    task.AssignedToUserId = dto.AssignedToUserId;
                }
            }

            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTask(int userId, int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null || !await HasProjectPermission(userId, task.ProjectId))
                return false;

            // Soft delete by changing status
            task.Status = Final_Project_Backend.Models.TaskStatus.Removed;
            await _context.SaveChangesAsync();
            return true;
        }

       public async Task<bool> HasWorkspacePermission(int userId, int workspaceId, bool allowViewer = false) {
    var userWorkspace = await _context.UserWorkspaces
        .FirstOrDefaultAsync(uw => uw.UserId == userId && uw.WorkspaceId == workspaceId);
    return userWorkspace != null && (allowViewer || userWorkspace.Role != WorkspaceRole.Viewer);
}

        public async Task<bool> HasProjectPermission(int userId, int projectId, bool allowViewer = false)
        {
            var project = await _context.Projects
                .Include(p => p.Workspace)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null) return false;
            return await HasWorkspacePermission(userId, project.WorkspaceId, allowViewer);
        }

        public async Task<Comment?> AddCommentToTask(int userId, int taskId, string content)
        {
            if (!await HasTaskPermission(userId, taskId, true))
                return null;

            var comment = new Comment
            {
                TaskId = taskId,
                UserId = userId,
                Content = content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<bool> MentionUserInComment(int commentId, int mentionedUserId)
        {
            var comment = await _context.Comments
                .Include(c => c.Task)
                .ThenInclude(t => t.Project)
                .FirstOrDefaultAsync(c => c.CommentId == commentId);

            if (comment == null) return false;

            // Check if mentioned user is in the same workspace
            var isInWorkspace = await _context.UserWorkspaces
                .AnyAsync(uw => uw.UserId == mentionedUserId && 
                               uw.WorkspaceId == comment.Task.Project.WorkspaceId);

            if (!isInWorkspace) return false;

            var mention = new Mention
            {
                CommentId = commentId,
                UserId = mentionedUserId,
                MentionedAt = DateTime.UtcNow
            };

            _context.Mentions.Add(mention);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Comment>> GetCommentsByTask(int taskId)
        {
            return await _context.Comments
                .Include(c => c.User)
                .Where(c => c.TaskId == taskId)
                .ToListAsync();
        }

       private async Task<bool> HasTaskPermission(int userId, int taskId, bool allowViewer = false)
{
    var task = await _context.Tasks
        .Include(t => t.Project)
        .FirstOrDefaultAsync(t => t.TaskId == taskId);

    if (task == null) return false;
    return await HasProjectPermission(userId, task.ProjectId, allowViewer);
}


        
    }
}