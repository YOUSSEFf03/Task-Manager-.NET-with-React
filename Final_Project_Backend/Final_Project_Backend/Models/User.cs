using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectTask = Final_Project_Backend.Models.Task;

namespace Final_Project_Backend.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; } 

        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Workspace> WorkspacesCreated { get; set; } = new List<Workspace>();
        public ICollection<UserWorkspace> UserWorkspaces { get; set; } = new List<UserWorkspace>();
        public ICollection<ProjectTask> TasksCreated { get; set; } = new List<ProjectTask>();
        public ICollection<ProjectTask> TasksAssigned { get; set; } = new List<ProjectTask>();
        public ICollection<Tag> TagsCreated { get; set; } = new List<Tag>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Mention> Mentions { get; set; } = new List<Mention>();
        public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}