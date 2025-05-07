using Final_Project_Backend.DTOs;
using System.Collections.Generic;
using Final_Project_Backend.Models; // Assuming NotificationType is in the Models namespace
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetNotifications(int userId);
        Task<int> CountUnreadNotifications(int userId);
        Task<bool> MarkNotificationAsRead(int userId, int notificationId);
        System.Threading.Tasks.Task CreateNotification(int userId, NotificationType type, string message);
        System.Threading.Tasks.Task CreateNotification(int userId, NotificationType type, string message, int? taskId = null);
    }
}
