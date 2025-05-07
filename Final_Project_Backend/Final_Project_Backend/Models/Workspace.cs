using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Final_Project_Backend.Models
{
    public class Workspace
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WorkspaceId { get; set; }  // Primary Key
        
        // Workspace Name and Description
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // User who created the workspace
        public int CreatedByUserId { get; set; }  // Foreign Key
        
        public User CreatedByUser { get; set; } = null!;
        
        // Relationships for many-to-many and one-to-many associations
        public ICollection<UserWorkspace> UserWorkspaces { get; set; } = new List<UserWorkspace>();
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();

        // Parameterless constructor
        public Workspace() { }
    }
}

