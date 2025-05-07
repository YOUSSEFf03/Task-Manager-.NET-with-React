using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
// using YourProjectNamespace.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface IWorkspaceService
    {
         Task<IEnumerable<Workspace>> GetWorkspacesByUser(int userId);
        Task<IEnumerable<WorkspaceResponseDto>> GetWorkspaceDtosByUser(int userId);
        Task<Workspace> CreateWorkspace(int userId, WorkspaceCreateDto workspaceDto);
        Task<bool> AddUserToWorkspace(int requestingUserId, int workspaceId, AddUserToWorkspaceDto dto);
        Task<IEnumerable<User>> GetUserWorkspaces(int workspaceId);
        Task<bool> RemoveUserFromWorkspace(int requestingUserId, int workspaceId, int userIdToRemove);

        Task<Workspace?> UpdateWorkspace(int userId, int workspaceId, WorkspaceUpdateDto dto);
        Task<bool> DeleteWorkspace(int userId, int workspaceId);

        Task<Dictionary<WorkspaceRole, int>> CountWorkspacesByRole(int userId);

        Task<Tag?> CreateTag(int userId, int workspaceId, CreateTagDto dto);
        Task<bool> AssignTagToTask(int userId, int taskId, int tagId);
        Task<bool> HasAccessToTaskWorkspace(int userId, int taskId);

        Task<Comment?> AddCommentToTask(int userId, int taskId, string content);
        Task<bool> MentionUserInComment(int commentId, int mentionedUserId);
        Task<IEnumerable<Comment>> GetCommentsByTask(int taskId);

        Task<IEnumerable<User>> SearchUsers(string query);
    }
}