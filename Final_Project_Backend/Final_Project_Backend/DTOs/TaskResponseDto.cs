using Final_Project_Backend.Models;
using TaskStatus = Final_Project_Backend.Models.TaskStatus;

namespace Final_Project_Backend.DTOs
{
    public class TaskResponseDto
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        
        // Change from enum to string to match model
        public required string Priority { get; set; } 
        public required string Status { get; set; }
        
        public DateTime? DueDate { get; set; }
        public int ProjectId { get; set; }
        public int? ParentTaskId { get; set; }

        // Add parameterless constructor
        public TaskResponseDto() 
        {
            Priority = string.Empty;
            Status = string.Empty;
        }
    }
}