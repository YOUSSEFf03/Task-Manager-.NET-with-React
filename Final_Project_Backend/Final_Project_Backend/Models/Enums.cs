// Models/Enums.cs


namespace Final_Project_Backend.Models
{
    public enum ProjectStatus
    {
        Unstarted,
        Active,
        Completed,
        Archived,
        Removed
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Critical
    }

    public enum TaskStatus
    {
        ToDo,
        InProgress,
        Done,
        Removed
    }

    public enum NotificationType
    {
        USER_ADDED_TO_WORKSPACE,
        TASK_ASSIGNED,
        MENTION_IN_COMMENT,
        TASK_DEADLINE_APPROACHING,
        USER_PROMOTED,
        USER_DEMOTED
    }
}