using System;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
   public class Attachment
{
    [Key]
    public int AttachmentId { get; set; }
    public int TaskId { get; set; } 
    public int UploadedByUserId { get; set; } 
    public string FileName { get; set; } = null!;
    public string FileUrl { get; set; } = null!;
    public DateTime UploadedAt { get; set; }

    public Task Task { get; set; } = null!;
    public User UploadedByUser { get; set; } = null!;
}
}
