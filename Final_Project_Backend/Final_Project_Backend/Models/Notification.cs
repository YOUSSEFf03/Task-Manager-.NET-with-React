using System;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; } 
        public int TaskId { get; set; }

        public string Message { get; set; } = null!;
        public int NotificationTypeId { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Task Task { get; set; } = null!;
        public NotificationType NotificationType { get; set; } = null!;
    }
}