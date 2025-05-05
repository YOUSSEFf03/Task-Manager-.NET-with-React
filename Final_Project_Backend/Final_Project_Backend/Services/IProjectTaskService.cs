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
    }
}