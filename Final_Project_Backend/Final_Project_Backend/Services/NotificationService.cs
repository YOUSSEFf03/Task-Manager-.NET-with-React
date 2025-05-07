using Final_Project_Backend.Data;
using Final_Project_Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Final_Project_Backend.Models; // Assuming NotificationType is in the Models namespace

namespace Final_Project_Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NotificationResponseDto>> GetNotifications(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .Select(n => new NotificationResponseDto
                {
                    NotificationId = n.NotificationId,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    NotificationType = n.NotificationType // Updated to use enum
                })
                .ToListAsync();
        }

        public async Task<int> CountUnreadNotifications(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .CountAsync();
        }

        public async Task<bool> MarkNotificationAsRead(int userId, int notificationId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId && n.UserId == userId);

            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async System.Threading.Tasks.Task CreateNotification(int userId, NotificationType type, string message)
        {
            await CreateNotification(userId, type, message, null);
        }

        public async System.Threading.Tasks.Task CreateNotification(int userId, NotificationType type, string message, int? taskId = null)
        {
            try
            {
                // Validate TaskId if provided
                if (taskId.HasValue)
                {
                    var taskExists = await _context.Tasks.AnyAsync(t => t.TaskId == taskId.Value);
                    if (!taskExists)
                    {
                        throw new KeyNotFoundException($"Task with ID {taskId.Value} does not exist.");
                    }
                }

                var notification = new Notification
                {
                    UserId = userId,
                    // NotificationType = type,
                    Message = message,
                    TaskId = taskId, // Nullable TaskId
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception or inspect the inner exception
                Console.WriteLine($"Error creating notification: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }
    }
}
