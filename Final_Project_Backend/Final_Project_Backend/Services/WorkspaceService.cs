// WorkspaceService.cs
using Final_Project_Backend.Data;
using Final_Project_Backend.Models;
using Final_Project_Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
// using YourProjectNamespace.Models;

namespace Final_Project_Backend.Services
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;

        public WorkspaceService(AppDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<Workspace>> GetWorkspacesByUser(int userId)
        {
            return await _context.UserWorkspaces
                .Where(wu => wu.UserId == userId)
                .Include(wu => wu.Workspace)
                .ThenInclude(w => w.Projects)
                .Select(wu => wu.Workspace)
                .ToListAsync();
        }

        public async Task<IEnumerable<WorkspaceResponseDto>> GetWorkspaceDtosByUser(int userId)
        {
            Console.WriteLine($"Getting workspaces for user ID: {userId}");

            var workspaces = await _context.UserWorkspaces
                .Where(wu => wu.UserId == userId)
                .Select(wu => new WorkspaceResponseDto(
                    wu.Workspace.WorkspaceId,
                    wu.Workspace.Name,
                    wu.Workspace.Description,
                    wu.Workspace.CreatedByUserId
                ))
                .ToListAsync();

            Console.WriteLine($"Found {workspaces.Count} workspaces");

            return workspaces;
        }

        public async Task<Workspace> CreateWorkspace(int userId, WorkspaceCreateDto workspaceDto)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var workspace = new Workspace
            {
                Name = workspaceDto.Name,
                Description = workspaceDto.Description,
                CreatedByUserId = userId
            };

            _context.Workspaces.Add(workspace);
            await _context.SaveChangesAsync();

            var userWorkspace = new UserWorkspace
            {
                WorkspaceId = workspace.WorkspaceId,
                UserId = userId,
                Role = WorkspaceRole.Admin,
                JoinedAt = DateTime.UtcNow,
                User = user
            };

            _context.UserWorkspaces.Add(userWorkspace);
            await _context.SaveChangesAsync();

            return workspace;
        }



        public async Task<bool> AddUserToWorkspace(int requestingUserId, int workspaceId, AddUserToWorkspaceDto dto)
        {
  
            var requestingUserRole = await _context.UserWorkspaces
                .FirstOrDefaultAsync(wu => wu.WorkspaceId == workspaceId && wu.UserId == requestingUserId);

            if (requestingUserRole == null || requestingUserRole.Role != WorkspaceRole.Admin)
            {
                return false;
            }


            var userToAdd = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (userToAdd == null)
            {
                return false;
            }


            var existingMembership = await _context.UserWorkspaces
                .FirstOrDefaultAsync(wu => wu.WorkspaceId == workspaceId && wu.UserId == userToAdd.UserId);

            if (existingMembership != null)
            {
                return false;
            }

            var UserWorkspace = new UserWorkspace
            {
                WorkspaceId = workspaceId,
                UserId = userToAdd.UserId,
                Role = dto.Role,
                JoinedAt = DateTime.UtcNow,
                User = userToAdd
            };

            _context.UserWorkspaces.Add(UserWorkspace);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<User>> GetUserWorkspaces(int workspaceId)
        {
            return await _context.UserWorkspaces
                .Where(wu => wu.WorkspaceId == workspaceId)
                .Include(wu => wu.User)
                .Select(wu => wu.User)
                .ToListAsync();
        }

        public async Task<bool> RemoveUserFromWorkspace(int requestingUserId, int workspaceId, int userIdToRemove)
        {
            var requestingUserRole = await _context.UserWorkspaces
                .FirstOrDefaultAsync(uw => uw.WorkspaceId == workspaceId && uw.UserId == requestingUserId);

            if (requestingUserRole?.Role != WorkspaceRole.Admin)
                return false;

            var userWorkspace = await _context.UserWorkspaces
                .FirstOrDefaultAsync(uw => uw.WorkspaceId == workspaceId && uw.UserId == userIdToRemove);

            if (userWorkspace == null) return false;

            _context.UserWorkspaces.Remove(userWorkspace);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Workspace?> UpdateWorkspace(int userId, int workspaceId, WorkspaceUpdateDto dto)
        {
            var workspace = await _context.Workspaces
                .Include(w => w.UserWorkspaces)
                .FirstOrDefaultAsync(w => w.WorkspaceId == workspaceId);

            if (workspace?.UserWorkspaces.FirstOrDefault(uw => uw.UserId == userId)?.Role != WorkspaceRole.Admin)
                return null;

            workspace.Name = dto.Name ?? workspace.Name;
            workspace.Description = dto.Description ?? workspace.Description;

            await _context.SaveChangesAsync();
            return workspace;
        }

        public async Task<bool> DeleteWorkspace(int userId, int workspaceId)
        {
            var workspace = await _context.Workspaces
                .Include(w => w.UserWorkspaces)
                .FirstOrDefaultAsync(w => w.WorkspaceId == workspaceId);

            if (workspace?.UserWorkspaces.FirstOrDefault(uw => uw.UserId == userId)?.Role != WorkspaceRole.Admin)
                return false;

            _context.Workspaces.Remove(workspace);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Dictionary<WorkspaceRole, int>> CountWorkspacesByRole(int userId)
        {
            var roleCounts = await _context.UserWorkspaces
                .Where(uw => uw.UserId == userId)
                .GroupBy(uw => uw.Role)
                .Select(group => new
                {
                    Role = group.Key,
                    Count = group.Count()
                })
                .ToDictionaryAsync(g => g.Role, g => g.Count);

            return roleCounts;
        }

        public async Task<Tag?> CreateTag(int userId, int workspaceId, CreateTagDto dto)
        {
            var workspace = await _context.Workspaces
                .FirstOrDefaultAsync(w => w.WorkspaceId == workspaceId && w.CreatedByUserId == userId);

            if (workspace == null)
                return null;

            var tag = new Tag
            {
                Name = dto.Name,
                Color = dto.Color,
                CreatedByUserId = userId,
                WorkspaceId = workspaceId,
                CreatedByUser = await _userRepository.GetUserByIdAsync(userId),
                Workspace = workspace
            };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return tag;
        }

        public async Task<bool> AssignTagToTask(int userId, int taskId, int tagId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            if (task == null || task.Project.CreatedByUserId != userId)
                return false;

            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagId == tagId);
            if (tag == null || tag.WorkspaceId != task.Project.WorkspaceId)
                return false;

            var taskTag = new TaskTag
            {
                TaskId = taskId,
                TagId = tagId
            };

            _context.TaskTags.Add(taskTag);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> HasAccessToTaskWorkspace(int userId, int taskId)
        {
            // Get the task and include its project and workspace
            var task = await _context.Tasks
                .Include(t => t.Project)
                .ThenInclude(p => p.Workspace)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            if (task == null)
                return false;

            // Check if the user is part of the workspace
            var isUserInWorkspace = await _context.UserWorkspaces
                .AnyAsync(uw => uw.WorkspaceId == task.Project.Workspace.WorkspaceId && uw.UserId == userId);

            return isUserInWorkspace;
        }
    }
}