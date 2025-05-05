using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface IWorkspaceService
    {
        Task<IEnumerable<Workspace>> GetWorkspacesByUser(int userId);
        Task<Workspace> CreateWorkspace(int userId, WorkspaceCreateDto workspaceDto);
        Task<bool> AddUserToWorkspace(int requestingUserId, int workspaceId, AddUserToWorkspaceDto dto);
        Task<IEnumerable<User>> GetWorkspaceUsers(int workspaceId);
    }
}