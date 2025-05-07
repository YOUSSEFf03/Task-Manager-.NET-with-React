import React, { useState, useEffect } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import '../styles/inputSearch.css';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import '../styles/layout.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusLabels = {
  0: "Unstarted",
  1: "Active",
  2: "Completed",
  3: "Archived",
  4: "Removed",
};

const ProjectCard = ({ projectId, name, description, deadline, status }) => {
  const navigate = useNavigate();

  const statusColors = {
    unstarted: 'var(--neutral-500)',
    active: 'var(--warning-color)',
    completed: 'var(--success-color)',
    archived: 'var(--info-color)',
    removed: 'var(--error-color)',
    default: '#ccc'
  };

  const statusLabel = statusLabels[status];

  const handleCardClick = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div onClick={handleCardClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '6px',
        padding: '16px',
        width: '250px',
        margin: '12px',
        boxShadow: 'var(--shadow-light)',
        borderLeft: `6px solid ${statusColors[statusLabel?.toLowerCase()] || statusColors.default}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
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

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');

  const inputStyle = {
    width: '95%',
    minWidth: '95%',
    maxWidth: '95%',
    padding: '8px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
  };

  const handleCreate = () => {
    const newProject = {
      name,
      description,
      status: "Unstarted",
      startDate,
      deadline,
    };
    onCreate(newProject);
    setName('');
    setDescription('');
    setStartDate('');
    setDeadline('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ margin: 0 }}>Create Project</h3>
        <div>
          <label htmlFor="projectName" style={{ display: 'block', fontSize: '14px' }}>Project Name</label>
          <input
            id="projectName"
            style={inputStyle}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="projectDescription" style={{ fontSize: '14px', display: 'block' }}>Project Description</label>
          <textarea
            id="projectDescription"
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="startDate" style={{ fontSize: '14px', display: 'block' }}>Start Date</label>
          <input
            id="startDate"
            style={inputStyle}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="deadline" style={{ fontSize: '14px', display: 'block' }}>Deadline</label>
          <input
            id="deadline"
            style={inputStyle}
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <Button text="Create Project" onClick={handleCreate} />
        <Button text="Cancel" onClick={onClose} color="tertiary" />
      </div>
    </div>
  );
};


const Workspace = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  // const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5137/api/projects/workspaces/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (newProject) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:5137/api/projects/workspaces/${workspaceId}`, {
        ...newProject,
        status: 0
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button onClick={() => setIsModalOpen(true)}
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

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              projectId={project.projectId}
              name={project.name}
              description={project.description}
              deadline={project.deadline}
              status={project.status}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Workspace;
