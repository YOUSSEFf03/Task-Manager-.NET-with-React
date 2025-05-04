using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
public class Workspace
{
    [Key]
public int WorkspaceId { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CreatedByUserId { get; set; } 
    
    public User CreatedByUser { get; set; } = null!;
    public ICollection<UserWorkspace> UserWorkspaces { get; set; } = new List<UserWorkspace>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();

    // Remove the constructor or make it parameterless
    public Workspace()
    {
    }
}
}
