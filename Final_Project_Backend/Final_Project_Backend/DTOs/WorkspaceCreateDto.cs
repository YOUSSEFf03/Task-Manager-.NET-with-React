using System.ComponentModel.DataAnnotations;

public class WorkspaceCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }

    public WorkspaceCreateDto(string name, string description)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name)); // Ensure Name is not null
        Description = description ?? throw new ArgumentNullException(nameof(description)); // Ensure Description is not null
    }
}


