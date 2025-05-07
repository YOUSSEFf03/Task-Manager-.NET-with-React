using System.ComponentModel.DataAnnotations;

using Final_Project_Backend.Models;
namespace Final_Project_Backend.DTOs
{
   public class NotificationResponseDto
{
    public int NotificationId { get; set; }

    public string Message { get; set; } = string.Empty; 

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public NotificationType NotificationType { get; set; } // Added enum property
}

}