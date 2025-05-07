import React, { useState } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css';

// UserModal Component
const UserModal = ({ show, onClose }) => {
    if (!show) return null;
  
    const users = [
      { name: 'Demo User', role: 'Admin' },
      { name: 'Alex Smith', role: 'Member' },
      { name: 'Jane Doe', role: 'Viewer' },
    ];
  
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
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
            }} />
          </div>
  
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', color: '#555' }}>Description</label>
            <textarea placeholder="Enter task description" style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
              height: '80px',
            }} />
          </div>
  
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', color: '#555' }}>Assign To</label>
            <select style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
            }}>
              {users.map((user, idx) => (
                <option key={idx} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
  
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', color: '#555' }}>Due Date (Optional)</label>
            <input type="date" style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginTop: '8px',
            }} />
          </div>
  
          <div style={{ textAlign: 'center' }}>
            <Button text="Create Task" color="primary" style={{ padding: '10px 20px', fontSize: '14px' }} />
          </div>
        </div>
      </div>
    );
  };
  

// TaskCard Component
const TaskCard = ({ name, assignedTo, tag }) => {
  const tagColors = {
    frontend: '#FF6B6B',
    backend: '#4ECDC4',
    design: '#FFD93D',
    devops: '#1A535C',
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '6px',
      padding: '12px',
      width: '240px',
      marginBottom: '12px',
      boxShadow: 'var(--shadow-light)',
      borderLeft: `6px solid ${tagColors[tag] || '#ccc'}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#333' }}>{name}</h4>
      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Assigned to: {assignedTo}</p>
    </div>
  );
};

// Main ProjectPage
const ProjectPage = () => {
  const [showModal, setShowModal] = useState(false);

  const tasks = {
    todo: [
      { name: 'Design Login Page', assignedTo: 'Jane Doe', tag: 'design' },
      { name: 'API Setup', assignedTo: 'Alex Smith', tag: 'backend' },
      { name: 'Design Login Page', assignedTo: 'Jane Doe', tag: 'design' },
      { name: 'API Setup', assignedTo: 'Alex Smith', tag: 'backend' },
    ],
    inProgress: [
      { name: 'Build Sidebar', assignedTo: 'Demo User', tag: 'frontend' },
    ],
    done: [
      { name: 'Create Repo', assignedTo: 'Jane Doe', tag: 'devops' },
    ],
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', padding: '24px' }}>
      {/* Modal */}
      <UserModal show={showModal} onClose={() => setShowModal(false)} />

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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <H level={2} style={{ margin: 0, color: '#fff' }}>Project Alpha</H>
            <H level={3} style={{ margin: 0, color: '#fff' }}>Tasks</H>
          </div>
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
      <div className="task-columns">
        <div className="task-column">
          <H level={4} style={{ marginBottom: '12px' }}>To Do</H>
          {tasks.todo.map((task, idx) => (
            <TaskCard key={idx} {...task} />
          ))}
        </div>

        <div className="task-column">
          <H level={4} style={{ marginBottom: '12px' }}>In Progress</H>
          {tasks.inProgress.map((task, idx) => (
            <TaskCard key={idx} {...task} />
          ))}
        </div>

        <div className="task-column">
          <H level={4} style={{ marginBottom: '12px' }}>Done</H>
          {tasks.done.map((task, idx) => (
            <TaskCard key={idx} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
