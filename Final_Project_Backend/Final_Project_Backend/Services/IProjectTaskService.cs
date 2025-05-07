using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Task = Final_Project_Backend.Models.Task;

namespace Final_Project_Backend.Services
{
    public interface IProjectTaskService
    {
        Task<Project> CreateProject(int userId, int workspaceId, ProjectCreateDto projectDto);
        Task<Task> CreateTask(int userId, int projectId, TaskCreateDto taskDto);
        Task<Task> CreateSubtask(int userId, int taskId, SubtaskCreateDto subtaskDto);
        Task<IEnumerable<ProjectResponseDto>> GetProjects(int workspaceId, int userId);
        Task<ProjectResponseDto?> GetProjectById(int userId, int projectId);
        Task<IEnumerable<TaskResponseDto>> GetTasks(int projectId, int userId);
        Task<IEnumerable<TaskResponseDto>> GetSubtasks(int parentTaskId, int userId);
        Task<Project?> UpdateProject(int userId, int projectId, ProjectUpdateDto dto);
        Task<bool> DeleteProject(int userId, int projectId);
        Task<Task?> UpdateTask(int userId, int taskId, TaskUpdateDto dto);
        Task<bool> DeleteTask(int userId, int taskId);
        Task<bool> HasWorkspacePermission(int userId, int workspaceId, bool allowViewer = false);
        Task<bool> HasProjectPermission(int userId, int projectId, bool allowViewer = false);
        Task<Comment?> AddCommentToTask(int userId, int taskId, string content);
        Task<bool> MentionUserInComment(int commentId, int mentionedUserId);
        Task<IEnumerable<Comment>> GetCommentsByTask(int taskId);
        Task<IEnumerable<WorkspaceUserResponseDto>> GetWorkspaceUsers(int workspaceId, int userId);
    }
}