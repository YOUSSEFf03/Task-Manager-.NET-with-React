using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
 public class Project
{
    [Key]
public int ProjectId { get; set; } 
    public int WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    
    public Workspace Workspace { get; set; } = null!; // Mark as non-nullable but initialize as null
    public ICollection<Task> Tasks { get; set; } = new List<Task>();

    public Project()
    {
        Tasks = new List<Task>();
        // Remove the Workspace initialization since it will be set via navigation
    }
}

}
