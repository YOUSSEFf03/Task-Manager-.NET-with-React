using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
    public class NotificationType
{
    public int NotificationTypeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<Notification> Notifications { get; set; }

    public NotificationType()
    {
        Notifications = new List<Notification>(); // Initialize the list
        Name = string.Empty; // Initialize Name to a default value
        Description = string.Empty;
    }
}

}
