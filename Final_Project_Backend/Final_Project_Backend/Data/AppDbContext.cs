using Final_Project_Backend.Models;
using Microsoft.EntityFrameworkCore;
using Task = Final_Project_Backend.Models.Task;

namespace Final_Project_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public AppDbContext() { }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Workspace> Workspaces { get; set; }
        public DbSet<UserWorkspace> UserWorkspaces { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<TaskTag> TaskTags { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Mention> Mentions { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationType> NotificationTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Task relationships
           modelBuilder.Entity<Task>()
        .HasOne(t => t.AssignedToUser)
        .WithMany(u => u.TasksAssigned)
        .HasForeignKey(t => t.AssignedToUserId)
        .OnDelete(DeleteBehavior.Restrict)
        .IsRequired(false); // Makes the relationship optional

    modelBuilder.Entity<Task>()
        .HasOne(t => t.CreatedByUser)
        .WithMany(u => u.TasksCreated)
        .HasForeignKey(t => t.CreatedByUserId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Task>()
        .HasOne(t => t.ParentTask)
        .WithMany()
        .HasForeignKey(t => t.ParentTaskId)
        .OnDelete(DeleteBehavior.Restrict)
        .IsRequired(false);

    modelBuilder.Entity<Task>()
        .HasOne(t => t.Project)
        .WithMany(p => p.Tasks)
        .HasForeignKey(t => t.ProjectId)
        .OnDelete(DeleteBehavior.Cascade);

    // Configure UserWorkspace
    modelBuilder.Entity<UserWorkspace>()
        .HasOne(uw => uw.User)
        .WithMany(u => u.UserWorkspaces)
        .HasForeignKey(uw => uw.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<UserWorkspace>()
        .HasOne(uw => uw.Workspace)
        .WithMany(w => w.UserWorkspaces)
        .HasForeignKey(uw => uw.WorkspaceId)
        .OnDelete(DeleteBehavior.Cascade);

    // Configure TaskTag
    modelBuilder.Entity<TaskTag>()
        .HasKey(tt => tt.TaskTagId);

    modelBuilder.Entity<TaskTag>()
        .HasOne(tt => tt.Task)
        .WithMany(t => t.TaskTags)
        .HasForeignKey(tt => tt.TaskId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<TaskTag>()
        .HasOne(tt => tt.Tag)
        .WithMany(t => t.TaskTags)
        .HasForeignKey(tt => tt.TagId)
        .OnDelete(DeleteBehavior.Cascade);

       
modelBuilder.Entity<Comment>()
    .HasOne(c => c.Task)
    .WithMany(t => t.Comments)
    .HasForeignKey(c => c.TaskId)
    .OnDelete(DeleteBehavior.Cascade);


    // Configure Notification
    modelBuilder.Entity<Notification>()
        .HasOne(n => n.Task)
        .WithMany(t => t.Notifications)
        .HasForeignKey(n => n.TaskId)
        .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<TaskTag>()
                .HasKey(tt => new { tt.TaskId, tt.TagId });



    modelBuilder.Entity<Mention>()
    .HasOne(m => m.Comment)
    .WithMany(c => c.Mentions)
    .HasForeignKey(m => m.CommentId)
    .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Mention>()
    .HasOne(m => m.Comment)
    .WithMany(c => c.Mentions)
    .HasForeignKey(m => m.CommentId)
    .OnDelete(DeleteBehavior.Cascade);



modelBuilder.Entity<Mention>()
    .HasOne(m => m.User)
    .WithMany(u => u.Mentions)
    .HasForeignKey(m => m.UserId)
    .OnDelete(DeleteBehavior.Cascade);



modelBuilder.Entity<Attachment>()
    .HasOne(a => a.Task)
    .WithMany(t => t.Attachments)
    .HasForeignKey(a => a.TaskId)
    .OnDelete(DeleteBehavior.Cascade);



modelBuilder.Entity<Notification>()
    .HasOne(n => n.NotificationType)
    .WithMany(nt => nt.Notifications)
    .HasForeignKey(n => n.NotificationTypeId)
    .OnDelete(DeleteBehavior.Cascade);

            
        }
    }
}