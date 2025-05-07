import React, { useState, useEffect } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import '../styles/inputSearch.css';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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


const Workspace = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5137/api/workspaces/${workspaceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkspace(response.data);
      } catch (error) {
        console.error('Error fetching workspace:', error);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

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
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <H level={3} style={{ margin: 0 }}>{workspace.name}</H>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <InputWithSVG searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
        <div className='banner-content-dashboard' style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <H level={4} style={{ margin: 0 }}>
            Empower Your Team — Start a Project and Collaborate Effortlessly to Turn Ideas into Action!
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
