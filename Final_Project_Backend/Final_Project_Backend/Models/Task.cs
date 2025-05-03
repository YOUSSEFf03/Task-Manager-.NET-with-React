using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
   public class Task
{
    [Key]
    public int TaskId { get; set; }

    
    [Required]
    public int ProjectId { get; set; } 
    
    [Required]
    public  int CreatedByUserId { get; set; } 
    
    public int? AssignedToUserId { get; set; }
    public int? ParentTaskId { get; set; }
    
    [Required]
    public string Priority { get; set; } = "Medium";
    
    [Required]
    public string Status { get; set; } = "ToDo";
    
    public DateTime? DueDate { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Project Project { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
    public User? AssignedToUser { get; set; }
    public Task? ParentTask { get; set; }

    // Collections
    public ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
}
