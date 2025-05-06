// UserWorkspace.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
// using YourProjectNamespace.Models;

namespace Final_Project_Backend.Models
{
    public class UserWorkspace
    {
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        
        public int UserId { get; set; }
        
        // [Key, Column(Order = 1)]
        public int WorkspaceId { get; set; }
        
        public WorkspaceRole Role { get; set; } = WorkspaceRole.Member;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        
        public required User User { get; set; }
       public Workspace Workspace { get; set; } = default!;
    }
}