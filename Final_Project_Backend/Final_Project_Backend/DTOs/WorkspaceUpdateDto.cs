using System.ComponentModel.DataAnnotations;
namespace Final_Project_Backend.DTOs;
public class WorkspaceUpdateDto
{
    [MaxLength(100)]
    public string? Name { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
}