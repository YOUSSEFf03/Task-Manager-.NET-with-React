using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using System.Threading.Tasks;
using Task = Final_Project_Backend.Models.Task;

namespace Final_Project_Backend.Services
{
    public interface IProjectTaskService
    {
        System.Threading.Tasks.Task<Project> CreateProject(int userId, int workspaceId, ProjectCreateDto projectDto);
        System.Threading.Tasks.Task<Task> CreateTask(int userId, int projectId, TaskCreateDto taskDto);
        System.Threading.Tasks.Task<Task> CreateSubtask(int userId, int taskId, SubtaskCreateDto subtaskDto);
        Task<IEnumerable<ProjectResponseDto>> GetProjects(int workspaceId , int userId);
        Task<IEnumerable<TaskResponseDto>> GetTasks(int projectId , int userId);
        Task<IEnumerable<TaskResponseDto>> GetSubtasks(int parentTaskId , int userId);
         Task<Project?> UpdateProject(int userId, int projectId, ProjectUpdateDto dto);
        Task<bool> DeleteProject(int userId, int projectId);
        Task<Task?> UpdateTask(int userId, int taskId, TaskUpdateDto dto);
        Task<bool> DeleteTask(int userId, int taskId);
    }
}