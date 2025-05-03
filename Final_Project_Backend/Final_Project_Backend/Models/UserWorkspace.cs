using System;
using System.ComponentModel.DataAnnotations;
using Final_Project_Backend.Models;

namespace Final_Project_Backend.Models
{
    public class UserWorkspace
    {
        public int UserWorkspaceId { get; set; }
        public required int UserId { get; set; }
        public int WorkspaceId { get; set; }
        public required string Role { get; set; }

        public required User User { get; set; }
        public required Workspace Workspace { get; set; }
    }
}