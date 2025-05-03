using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
 public class TaskTag
{
    public int TaskTagId { get; set; }
    
    // Foreign keys
    public int TaskId { get; set; }
    public int TagId { get; set; }
    
    // Navigation properties (made nullable)
    public Task? Task { get; set; }
    public Tag? Tag { get; set; }
}

}
