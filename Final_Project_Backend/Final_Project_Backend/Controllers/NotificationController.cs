using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Final_Project_Backend.Services;
using System.Security.Claims;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var notifications = await _notificationService.GetNotifications(userId);
        return Ok(notifications);
    }

    [HttpGet("count-unread")]
    public async Task<IActionResult> CountUnreadNotifications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var count = await _notificationService.CountUnreadNotifications(userId);
        return Ok(count);
    }

    [HttpPut("{notificationId}/mark-as-read")]
    public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not authenticated");
        }
        var userId = int.Parse(userIdClaim.Value);

        var result = await _notificationService.MarkNotificationAsRead(userId, notificationId);
        return result ? NoContent() : BadRequest("Failed to mark notification as read");
    }
}
