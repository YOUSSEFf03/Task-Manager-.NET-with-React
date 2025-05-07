using System;
using System.ComponentModel.DataAnnotations;
using Final_Project_Backend.Models;

namespace Final_Project_Backend.DTOs


{
    public class ProjectCreateDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; } = string.Empty;

        public ProjectStatus Status { get; set; } = ProjectStatus.Unstarted;
        public DateTime StartDate { get; set; }  // Added
        public DateTime Deadline { get; set; }   // Added
    }
}