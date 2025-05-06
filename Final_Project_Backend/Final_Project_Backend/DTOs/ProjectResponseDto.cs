using Final_Project_Backend.Models;

namespace Final_Project_Backend.DTOs
{
    public class ProjectResponseDto
{
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public int WorkspaceId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CreatedByUserId { get; set; }
}
}