using Final_Project_Backend.Models;
using TaskStatus = Final_Project_Backend.Models.TaskStatus;

namespace Final_Project_Backend.DTOs
{
    public class TaskResponseDto
    {
         public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public int CreatedByUserId { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? ParentTaskId { get; set; }
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "ToDo";
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Additional fields if needed
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    
        public TaskResponseDto() 
        {
            Priority = string.Empty;
            Status = string.Empty;
        }
    }
}