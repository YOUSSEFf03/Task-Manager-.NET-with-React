// Models/Enums.cs


namespace Final_Project_Backend.Models
{
    public enum ProjectStatus
    {
        Unstarted,
        Active,
        Completed,
        Archived
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

    public enum WorkspaceRole
    {
        Admin,
        Member,
        Viewer
    }
}