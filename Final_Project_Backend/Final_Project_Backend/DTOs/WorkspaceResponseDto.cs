using System;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
   // WorkspaceResponseDto.cs
public class WorkspaceResponseDto
{
    public int WorkspaceId { get; set; }  // Changed from string to int
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CreatedByUserId { get; set; }
    public string Role { get; set; }

    public WorkspaceResponseDto(int workspaceId, string name, string description, int createdByUserId, string role)
    {
        WorkspaceId = workspaceId;
        Name = name;
        Description = description;
        CreatedByUserId = createdByUserId;
        Role = role;
    }
    
    public WorkspaceResponseDto() {}
}
}