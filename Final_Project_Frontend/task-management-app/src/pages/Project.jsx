import React, { useState, useEffect } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css';
import { useParams } from "react-router-dom";
import axios from "axios";

// UserModal Component
const UserModal = ({ show, onClose, addTaskToPage }) => {
  const { projectId } = useParams();
  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedToUserId: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (show) {
      fetchWorkspaceUsers();
    }
  }, [show]);

  const fetchWorkspaceUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const projectRes = await axios.get(
        `http://localhost:5137/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const workspaceId = projectRes.data.workspaceId;
      console.log("Workspace ID:", workspaceId);

      const response = await axios.get(
        `http://localhost:5137/api/workspaces/${workspaceId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredUsers = response.data.filter(
        (user) => user.role === "Admin" || user.role === "Member"
      );

      console.log("Filtered Users:", filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5137/api/projects/${projectId}/tasks`,
        {
          Title: taskData.title,
          Description: taskData.description,
          AssignedToUserId: taskData.assignedToUserId,
          Priority: taskData.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Task created successfully:", response.data);

      // Add the new task to the page
      addTaskToPage({
        taskId: response.data.taskId,
        title: taskData.title,
        assignedToUserId: taskData.assignedToUserId,
        dueDate: response.data.dueDate,
        priority: taskData.priority,
        status: "ToDo", // Default status for new tasks
      });

      onClose(); // Close the modal after task creation
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '400px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-light)',
        padding: '20px',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <H level={3} style={{ margin: 0 }}>Create Task</H>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}>×</button>
        </div>

        {/* Task Fields */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Task Name</label>
          <input
            type="text"
            placeholder="Enter task name"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            style={{
              width: '95%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Description (optional)</label>
          <textarea
            placeholder="Enter task description"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            style={{
              width: '95%',
              maxWidth: '95%',
              minWidth: '95%',
              fontFamily: 'Poppins, sans-serif',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
              height: '80px',
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Assign To</label>
          <select
            value={taskData.assignedToUserId}
            onChange={(e) => setTaskData({ ...taskData, assignedToUserId: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "8px",
            }}
          >
            <option value="">Select a user</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} ({user.role})
                </option>
              ))
            ) : (
              <option value="">No users available</option>
            )}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Priority</label>
          <select
            value={taskData.priority}
            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "8px",
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className='add-task-modal' style={{ textAlign: 'center' }}>
          <Button
            text="Create Task"
            color="primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
            onClick={handleCreateTask}
          />
        </div>
      </div>
    </div>
  );
};

const InputWithSVG = ({ searchTerm, setSearchTerm }) => (
  <div className="input-container">
    <div className="svg-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#AAAAAA" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    </div>
    <input
      type="text"
      className="search-input"
      placeholder="Search Projects"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);



const TaskCard = ({ taskId, title, assignedTo, dueDate, priority, onClick }) => {
  const priorityColors = {
    Low: '#4ECDC4',
    Medium: '#FFD93D',
    High: '#FF6B6B',
    Critical: '#1A535C',
  };

  const userMap = {
    7: "John Doe",
    8: "Jane Smith",
    9: "Alice Johnson",
  };

  const assignedToName = userMap[assignedTo] || "Unassigned";
  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date";

  return (
    <div
      onClick={() => onClick(taskId)}
      style={{
        cursor: 'pointer',
        backgroundColor: '#fff',
        borderRadius: '6px',
        padding: '12px',
        width: '240px',
        marginBottom: '12px',
        boxShadow: 'var(--shadow-light)',
        borderLeft: `6px solid ${priorityColors[priority] || '#ccc'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#333' }}>{title}</h4>
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Assigned to: {assignedToName}</p>
      <p style={{ fontSize: '12px', color: '#999', margin: '6px 0 0 0' }}>Due: {formattedDueDate}</p>
    </div>
  );
};


  const TaskDetailsModal = ({ show, onClose, taskId, projectId, allTasks ,onTaskUpdated }) => {
    const [taskDetails, setTaskDetails] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newSubtask, setNewSubtask] = useState("");
  
    useEffect(() => {
      if (show && taskId && allTasks) {
        // Find the task in the already fetched tasks
        const task = allTasks.find(t => t.taskId === taskId);
        setTaskDetails(task);
        
        // Fetch subtasks and comments if needed
        fetchSubtasks();
        fetchComments();
      }
    }, [show, taskId, allTasks]);
  
 
  
  const fetchSubtasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5137/api/projects/tasks/${taskId}/subtasks`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubtasks(response.data);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
    }
  };
  
  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5137/api/projects/tasks/${taskId}/comments`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddSubtask = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5137/api/projects/tasks/${taskId}/subtasks`,
        { title: newSubtask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSubtask("");
      fetchSubtasks();
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    if (!newComment.trim()) return; // Don't add empty comments
    
    try {
      const response = await axios.post(
        `http://localhost:5137/api/projects/tasks/${taskId}/comments`,
        {
          content: newComment
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Add new comment to the list
      setComments([...comments, response.data]);
      setNewComment(""); // Clear input field
      
    } catch (error) {
      console.error("Error adding comment:", error);
      // Add user feedback here
    }
  };

  const handleEditTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5137/api/projects/tasks/${taskId}`,
        {
          priority: taskDetails.priority,
          status: taskDetails.status
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state with the returned task data
      setTaskDetails(response.data);
      
      // Optionally notify parent component to refresh task list
      if (onTaskUpdated) onTaskUpdated();
      
    } catch (error) {
      console.error("Error editing task:", error);
      // Add user feedback here (e.g., toast notification)
    }
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5137/api/projects/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!show || !taskDetails) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '600px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-light)',
        padding: '20px',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2>{taskDetails.title}</h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}>×</button>
        </div>
        <p>{taskDetails.description}</p>
        <div style={{ marginTop: '16px' }}>
          <h3>Subtasks</h3>
          <ul>
            {subtasks.map(subtask => (
              <li key={subtask.id}>{subtask.title}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          <button onClick={handleAddSubtask}>Add Subtask</button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <h3>Comments</h3>
          <ul>
            {comments.map(comment => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
          <textarea
            placeholder="Add comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: '100%', marginBottom: '8px' }}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleEditTask}>Edit</button>
          <button onClick={handleDeleteTask} style={{ color: 'red' }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// Main ProjectPage
const ProjectPage = () => {
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); // Add state for UserModal
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [projectRes, tasksRes] = await Promise.all([
          axios.get(`http://localhost:5137/api/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5137/api/projects/${projectId}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProject(projectRes.data);

        const filteredTasks = tasksRes.data.filter(task => task.status !== "Removed");

        const categorizedTasks = {
          todo: filteredTasks.filter(task => task.status === "ToDo"),
          inProgress: filteredTasks.filter(task => task.status === "InProgress"),
          done: filteredTasks.filter(task => task.status === "Done"),
        };

        setTasks(categorizedTasks);

      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const addTaskToPage = (newTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTask], // Add the new task to the "To Do" list
    }));
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setShowTaskDetailsModal(true);
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  const filterTasks = (taskList) => {
    return taskList.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredTasks = {
    todo: filterTasks(tasks.todo),
    inProgress: filterTasks(tasks.inProgress),
    done: filterTasks(tasks.done),
  };

  const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];


  const refreshTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const tasksRes = await axios.get(
        `http://localhost:5137/api/projects/${projectId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const filteredTasks = tasksRes.data.filter(task => task.status !== "Removed");
      // Update your tasks state as before
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };


  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Task Details Modal */}
      <TaskDetailsModal
      show={showTaskDetailsModal}
      onClose={() => setShowTaskDetailsModal(false)}
      taskId={selectedTaskId}
      projectId={projectId}
      allTasks={allTasks}
      onTaskUpdated={refreshTasks}
    />

      {/* User Modal */}
      <UserModal
        show={showUserModal}
        onClose={() => setShowUserModal(false)} // Close UserModal
        addTaskToPage={addTaskToPage}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <H level={3} style={{ margin: 0, color: '#fff' }}>{project.name}</H>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <InputWithSVG searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* Banner section */}
      <div className="banner-dashboard" style={{
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: '24px 32px',
        borderRadius: 'var(--radius-16)',
        marginBottom: '32px',
      }}>
        <div className='banner-content-dashboard' style={{
          display: 'flex',
          gap: '12px',
          width: '65%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <H level={4} style={{ margin: 0 }}>
            Stay on top of your goals – Add tasks, organize your work, and watch your progress unfold effortlessly!
          </H>
          <Button
            iconLeft={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
            text="Add Task"
            color="primary"
            style={{ padding: '6px 12px', fontSize: '14px' }}
            onClick={() => setShowUserModal(true)} // Open UserModal
          />
        </div>
      </div>

      {/* Task Columns */}
      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ flex: 1 }}>
          <H level={4}>To Do</H>
          <div>
            {filteredTasks.todo.length > 0 ? (
              filteredTasks.todo.map(task => (
                <TaskCard
                  key={task.taskId}
                  taskId={task.taskId}
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  onClick={(id) => {
                    setSelectedTaskId(id);
                    setShowTaskDetailsModal(true);
                  }}
                />
              ))
            ) : (
              <p>No tasks found in To Do</p>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <H level={4}>In Progress</H>
          <div>
            {filteredTasks.inProgress.length > 0 ? (
              filteredTasks.inProgress.map(task => (
                <TaskCard
                  key={task.taskId}
                  taskId={task.taskId}
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  onClick={(id) => {
                    setSelectedTaskId(id);
                    setShowTaskDetailsModal(true);
                  }}
                />
              ))
            ) : (
              <p>No tasks found in Progress</p>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <H level={4}>Done</H>
          <div>
            {filteredTasks.done.length > 0 ? (
              filteredTasks.done.map(task => (
                <TaskCard
                  key={task.taskId}
                  taskId={task.taskId}
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  onClick={(id) => {
                    setSelectedTaskId(id);
                    setShowTaskDetailsModal(true);
                  }}
                />
              ))
            ) : (
              <p>No tasks found in Done</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
