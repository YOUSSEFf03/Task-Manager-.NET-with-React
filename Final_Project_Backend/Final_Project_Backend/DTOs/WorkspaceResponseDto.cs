using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class WorkspaceResponseDto
    {
        public int WorkspaceId { get; set; }
        
        // Declare Name and Description as nullable if they are optional
        public string? Name { get; set; }
        public string? Description { get; set; }
        
        public int CreatedByUserId { get; set; }

        // Constructor to ensure non-nullable properties are initialized
        public WorkspaceResponseDto(int workspaceId, string name, string description, int createdByUserId)
        {
            WorkspaceId = workspaceId;
            Name = name;
            Description = description;
            CreatedByUserId = createdByUserId;
        }
    }
}
