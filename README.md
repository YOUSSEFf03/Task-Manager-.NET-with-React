# 🗂️ Task Management Application

A backend API for a full-featured Task Management System that enables streamlined collaboration, task tracking, and workspace organization using role-based access control (Admin, Member, Viewer).

---

## 📌 Features

### 👤 Authentication
- `POST /signup`: Register with full name, email, and password. Returns `user_ID` and `created_at`. Redirects to login on success.
- `POST /login`: Authenticate with email/password. Returns JWT token.
- `POST /logout`: Logout and invalidate token.

---

### 🏠 Dashboard
- `GET /get-workspaces`: Fetch all user workspaces, grouped by role: Admin, Member, Viewer.
- `GET /count-workspaces-by-role`: Return counts of workspaces grouped by user role.
- `GET /get-notifications`: Get all notifications (task/project deadlines, mentions, assignments).
- `GET /count-not-read-notifications`: Count unread notifications (`isRead == false`).

---

### 🧩 Workspace Management
- `POST /create-workspace`: Create a new workspace with `name`, `description` (optional), `created_by_user_ID`.
- `POST /add-user`: Add an existing user to a workspace as a Member or Viewer.
- `GET /get-users`: List all users within a workspace and their roles.
- `GET /get-projects`: List all projects in a workspace.
- `POST /create-tag`: Create tags with `name`, `color_code`, and bind to a workspace.
- `PUT /edit-workspace`: Update workspace details.
- `DELETE /delete-workspace`: Change workspace status to `removed`.

---

### 📂 Project & Task Management
- `POST /create-project`: Create a project with `name`, `description`, `start_date`, `deadline`, `status`, `workspace_ID`.
- `PUT /edit-project`: Modify project data or status.
- `DELETE /delete-project`: Mark a project as `removed`.

- `POST /create-task`: Create a task with `priority`, `duedate`, `assigned_to_user_ID` (optional), `parent_task_ID` (optional).
- `POST /create-subtask`: Same as `/create-task` but must include `parent_task_ID`.
- `PUT /edit-task`: Update task details or tags.
- `DELETE /delete-task`: Mark task as `removed`.

---

### 🏷️ Tags & Comments
- `POST /assign-tag-to-task`: Assign an existing tag to a task (Admins and Members only).
- `POST /add-comment-on-task`: Add a comment to a task (All roles).
- `POST /mention-user-in-comment`: Mention a user in a comment to trigger a notification.

---

## 🛡️ Roles & Permissions

| Role    | Create/Edit/Delete Workspaces | Manage Users | Manage Projects/Tasks | Add Comments | Assign Tags |
|---------|-------------------------------|--------------|------------------------|--------------|-------------|
| Admin   | ✅                            | ✅           | ✅                     | ✅           | ✅          |
| Member  | ❌                            | ❌           | ✅                     | ✅           | ✅          |
| Viewer  | ❌                            | ❌           | ❌                     | ✅           | ❌          |

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (Token-based auth)
- **Architecture**: RESTful API

---

## 🧪 Status

✅ Fully functional backend  
🚧 No frontend included (APIs ready for integration)

---

## 📸 Screenshots

| Page             | Preview                                  |
|------------------|-------------------------------------------|
| **Landing Page** | ![Landing Page](/documents/screenshots/landingPage.png) |
| **Signup Page**  | ![Signup Page](/documents/screenshots/SignUp.png)   |
| **Workspace Page** | ![Workspace Page](/documents/screenshots/WorkspaceDashBoard.png) |
| **Project Page** | ![Project Page](/documents/screenshots/ProjectDashboard.png) |
| **Task Page**    | ![Task Page](/documents/screenshots/TaskDashBoard.png)       |

