using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
 // In Project.cs
public class Project
{
    [Key]
    public int ProjectId { get; set; } 
    public int WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int CreatedByUserId { get; set; } // Add this line
    
    public Workspace Workspace { get; set; } = null!;
    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}

}
