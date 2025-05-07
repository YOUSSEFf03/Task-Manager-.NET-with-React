using Final_Project_Backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Final_Project_Backend.Services
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetNotifications(int userId);
        Task<int> CountUnreadNotifications(int userId);
        Task<bool> MarkNotificationAsRead(int userId, int notificationId);
    }
}
