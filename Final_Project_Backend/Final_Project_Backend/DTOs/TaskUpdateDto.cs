using System.ComponentModel.DataAnnotations;
namespace Final_Project_Backend.DTOs;

public class TaskUpdateDto
{
    [MaxLength(200)]
    public string? Title { get; set; }
    
    public string? Description { get; set; }
    public string? Priority { get; set; }
    public string? Status { get; set; }
    public DateTime? DueDate { get; set; }
    public int? AssignedToUserId { get; set; }
}