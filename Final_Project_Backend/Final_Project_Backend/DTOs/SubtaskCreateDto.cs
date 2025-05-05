using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.DTOs
{
    public class SubtaskCreateDto : TaskCreateDto
    {
        [Required]
        public int ParentTaskId { get; set; }
    }
}