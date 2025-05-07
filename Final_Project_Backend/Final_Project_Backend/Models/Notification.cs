using System;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; } 
        public int? TaskId { get; set; } // Made TaskId nullable

        public string Message { get; set; } = null!;
        public NotificationType NotificationType { get; set; }

        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; } = null!;
        public Task? Task { get; set; } // Made Task navigation property nullable
    }
}