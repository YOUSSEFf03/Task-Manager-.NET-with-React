import React, { useState } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import '../styles/inputSearch.css';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css'

const ProjectCard = ({ name, description, deadline, status }) => {
  const statusColors = {
    unstarted: 'var(--error-color)',
    active: 'var(--warning-color)',
    completed: 'var(--success-color)',
    archived: 'var(--info-color)',
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '6px',
      padding: '16px',
      width: '250px',
      margin: '12px',
      boxShadow: 'var(--shadow-light)',
      borderLeft: `6px solid ${statusColors[status] || '#ccc'}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>{name}</h3>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{description}</p>
      <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Deadline: {deadline}</p>
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
        width: '500px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-light)',
        padding: '24px',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <H level={3} style={{ margin: 0 }}>Workspace Users Setting</H>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <InputWithSVG searchTerm={''} setSearchTerm={() => { }} />
          <Button text="Add User" color="primary" />
        </div>

        <H level={4} style={{ marginBottom: '12px' }}>Who has access</H>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map((user, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#EEE',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                color: '#555'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
  <div style={{ fontWeight: '500' }}>{user.name}</div>
  <div style={{ fontSize: '12px', color: '#888' }}>{user.role}</div>
</div>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Workspace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  const projects = [
    { name: 'Project Alpha', description: 'Redesign UI for dashboard', deadline: '2025-05-20', status: 'active' },
    { name: 'Project Beta', description: 'Fix login bug', deadline: '2025-05-10', status: 'unstarted' },
    { name: 'Project Gamma', description: 'Deploy to production', deadline: '2025-04-30', status: 'completed' },
    { name: 'Project Delta', description: 'Archive old data', deadline: '2025-05-05', status: 'archived' },
  ];

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', padding: '24px' }}>
      <UserModal show={showUserModal} onClose={() => setShowUserModal(false)} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <H level={2} style={{ margin: 0 }}>Workspace Projects</H>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <InputWithSVG searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Button text="Users Setting" onClick={() => setShowUserModal(true)} color="secondary" />
        </div>
      </div>

      <div className='banner-dashboard' style={{
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: '24px 32px',
        borderRadius: 'var(--radius-16)',
        marginBottom: '32px',
      }}>
        <div style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <H level={4} style={{ margin: 0 }}>
            Boost Your Productivity! Create a Workspace and Start Managing Your Projects Seamlessly.
          </H>
          <Button
            iconLeft={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
              viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>}
            text="Create Project"
            color="primary"
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}>
        {filteredProjects.map((project, idx) => (
          <ProjectCard key={idx} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Workspace;
