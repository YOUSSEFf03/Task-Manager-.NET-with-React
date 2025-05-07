// Models/Enums.cs


namespace Final_Project_Backend.Models
{
    // public enum ProjectStatus
    // {
    //     Unstarted,
    //     Active,
    //     Completed,
    //     Archived,
    //     Removed
    // }

    public enum ProjectStatus
    {
        Unstarted = 0,
        Active = 1,
        Completed = 2,
        Archived = 3,
        Removed = 4
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


}