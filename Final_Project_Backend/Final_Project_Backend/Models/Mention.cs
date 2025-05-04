using System;
using System.Collections.Generic;
using Final_Project_Backend.Models;

namespace Final_Project_Backend.Models
{
   public class Mention
{
    public int Id { get; set; }
    public int UserId { get; set; } 
    public int UserWorkspaceId { get; set; }
    public int? ProjectId { get; set; }
    public int? TagId { get; set; }
     public int CommentId { get; set; }   
    public DateTime MentionedAt { get; set; }


           
    public Comment? Comment { get; set; }

    public User User { get; set; } = null!;
    public UserWorkspace UserWorkspace { get; set; } = null!;
    public Project? Project { get; set; }
    public Tag? Tag { get; set; }
}
}