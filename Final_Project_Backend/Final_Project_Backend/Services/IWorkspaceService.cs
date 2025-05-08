using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface IWorkspaceService
    {
        Task<IEnumerable<Workspace>> GetWorkspacesByUser(int userId);
        Task<WorkspaceResponseDto?> GetWorkspaceById(int userId, int workspaceId);
        Task<IEnumerable<WorkspaceResponseDto>> GetWorkspaceDtosByUser(int userId);
        Task<WorkspaceResponseDto> CreateWorkspace(int userId, WorkspaceCreateDto workspaceDto);
        Task<bool> AddUserToWorkspace(int requestingUserId, int workspaceId, AddUserToWorkspaceDto dto);
        Task<IEnumerable<UserWithRoleDto>> GetUserWorkspaces(int workspaceId);
        Task<bool> RemoveUserFromWorkspace(int requestingUserId, int workspaceId, int userIdToRemove);
        Task<Workspace?> UpdateWorkspace(int userId, int workspaceId, WorkspaceUpdateDto dto);
        Task<bool> DeleteWorkspace(int userId, int workspaceId);
        Task<Dictionary<WorkspaceRole, int>> CountWorkspacesByRole(int userId);
        Task<Tag?> CreateTag(int userId, int workspaceId, CreateTagDto dto);
        Task<IEnumerable<Tag>> GetTagsByWorkspace(int userId, int workspaceId);
        Task<bool> AssignTagToTask(int userId, int taskId, int tagId);
        Task<bool> HasAccessToTaskWorkspace(int userId, int taskId);
        Task<IEnumerable<UserSearchDto>> SearchUsers(string query);
        Task<bool> IsWorkspaceAdmin(int userId, int workspaceId);
      
    }
}