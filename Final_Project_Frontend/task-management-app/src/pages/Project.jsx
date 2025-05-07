import React, { useState, useEffect } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css';
import { useParams } from "react-router-dom";
import axios from "axios";

// UserModal Component
const UserModal = ({ show, onClose }) => {
  const { projectId } = useParams();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (show) {
      fetchWorkspaceUsers();
    }
  }, [show]);

  const fetchWorkspaceUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5137/api/projects/workspaces/${projectId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredUsers = response.data.filter(
        (user) => user.Role === "Admin" || user.Role === "Member"
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
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
          <input type="text" placeholder="Enter task name" style={{
            width: '95%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginTop: '8px',
            fontFamily: 'Poppins, sans-serif',
          }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Description (optional)</label>
          <textarea placeholder="Enter task description" style={{
            width: '95%',
            maxWidth: '95%',
            minWidth: '95%',
            fontFamily: 'Poppins, sans-serif',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginTop: '8px',
            height: '80px',
          }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Assign To</label>
          <select
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
                <option key={user.UserId} value={user.UserId}>
                  {user.UserName} ({user.Role})
                </option>
              ))
            ) : (
              <option value="">No users available</option>
            )}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Due Date (Optional)</label>
          <input type="date" style={{
            width: '95%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginTop: '8px',
            fontFamily: 'Poppins, sans-serif',
          }} />
        </div>

        <div className='add-task-modal' style={{ textAlign: 'center' }}>
          <Button text="Create Task" color="primary" style={{ padding: '10px 20px', fontSize: '14px' }} />
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


// TaskCard Component
const TaskCard = ({ name, assignedTo, dueDate, priority }) => {
  const priorityColors = {
    Low: '#4ECDC4',
    Medium: '#FFD93D',
    High: '#FF6B6B',
    Critical: '#1A535C',
  };

  return (
    <div style={{
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
    }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#333' }}>{name}</h4>
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Assigned to: {assignedTo || "Unassigned"}</p>
      {dueDate && (
        <p style={{ fontSize: '12px', color: '#999', margin: '6px 0 0 0' }}>Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}
    </div>
  );
};

// Main ProjectPage
const ProjectPage = () => {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Modal */}
      <UserModal show={showModal} onClose={() => setShowModal(false)} />

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
            onClick={() => setShowModal(true)}
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
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
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
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
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
                  title={task.title}
                  assignedTo={task.assignedToUserId}
                  dueDate={task.dueDate}
                  priority={task.priority}
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
