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

// Keep this version in WorkspaceService.cs
public async Task<IEnumerable<Workspace>> GetWorkspacesByUser(int userId)
{
    return await _context.UserWorkspaces
        .Where(wu => wu.UserId == userId)
        .Include(wu => wu.Workspace)
        .ThenInclude(w => w.Projects)
        .Select(wu => wu.Workspace)
        // .OrderByDescending(w => w.CreatedAt)
        .ToListAsync();
}


// Add this new method for DTO version
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


 // Change CreateWorkspace method to:
public async Task<Workspace> CreateWorkspace(int userId, WorkspaceCreateDto workspaceDto)
{
    // Fetch the user who is creating the workspace
    var user = await _userRepository.GetUserByIdAsync(userId);
    if (user == null)
    {
        throw new Exception("User not found");
    }

    // Create a new workspace
    var workspace = new Workspace
    {
        Name = workspaceDto.Name,
        Description = workspaceDto.Description,
        CreatedByUserId = userId
    };

    // Add workspace to the context
    _context.Workspaces.Add(workspace);
    await _context.SaveChangesAsync();

    // Now create the UserWorkspace association
    var userWorkspace = new UserWorkspace
    {
        WorkspaceId = workspace.WorkspaceId,
        UserId = userId,
        Role = WorkspaceRole.Admin,
        JoinedAt = DateTime.UtcNow,
        User = user  // Set the required 'User' property
    };

    // Add the UserWorkspace to the context
    _context.UserWorkspaces.Add(userWorkspace);
    await _context.SaveChangesAsync();

    // Return the created workspace
    return workspace;  // Ensure you're returning just the Workspace object
}



        public async Task<bool> AddUserToWorkspace(int requestingUserId, int workspaceId, AddUserToWorkspaceDto dto)
        {
            // Check if requesting user has permission (must be admin)
            var requestingUserRole = await _context.UserWorkspaces
                .FirstOrDefaultAsync(wu => wu.WorkspaceId == workspaceId && wu.UserId == requestingUserId);

            if (requestingUserRole == null || requestingUserRole.Role != WorkspaceRole.Admin)
            {
                return false;
            }

            // Check if user exists
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
    // Verify requesting user is admin
    var requestingUserRole = await _context.UserWorkspaces
        .FirstOrDefaultAsync(uw => uw.WorkspaceId == workspaceId && uw.UserId == requestingUserId);

    if (requestingUserRole?.Role != WorkspaceRole.Admin)
        return false;

    // Remove user
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
}
}