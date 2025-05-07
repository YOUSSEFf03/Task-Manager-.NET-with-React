// Project.cs
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
        public ProjectStatus Status { get; set; } = ProjectStatus.Unstarted;
        public DateTime? StartDate { get; set; }
        public DateTime? Deadline { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public int CreatedByUserId { get; set; }
        
        public Workspace Workspace { get; set; } = null!;
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}