using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
   public class TaskCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; } // Nullable type is fine here

    public int? AssignedToUserId { get; set; }

    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }
}

}