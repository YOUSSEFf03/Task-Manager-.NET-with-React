using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
    public class Tag
    {
        [Key]
        public int TagId { get; set; }

        public required string Name { get; set; }
        public required string Color { get; set; }
        public required int CreatedByUserId { get; set; }
        public int WorkspaceId { get; set; }
        
        public required User CreatedByUser { get; set; }
        public required Workspace Workspace { get; set; }
        public ICollection<TaskTag> TaskTags { get; set; } = new List<TaskTag>();
    }
}