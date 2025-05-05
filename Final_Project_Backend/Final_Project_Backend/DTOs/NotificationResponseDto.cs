using System.ComponentModel.DataAnnotations;
namespace Final_Project_Backend.DTOs
{
   public class NotificationResponseDto
{
    public int NotificationId { get; set; }

    public string Message { get; set; } = string.Empty; // Initialize with an empty string

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }
}

}