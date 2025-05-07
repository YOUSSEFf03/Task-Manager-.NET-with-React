using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Final_Project_Backend.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Task Task { get; set; } = null!;
        public User User { get; set; } = null!;
        public ICollection<Mention> Mentions { get; set; } = new List<Mention>();

    }
}