using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class ProjectCreateDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; } = string.Empty; // Make it nullable and initialized

    public string Status { get; set; } = "Unstarted";
}

}