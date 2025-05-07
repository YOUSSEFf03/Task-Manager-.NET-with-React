import React, { useState, useEffect } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import '../styles/inputSearch.css';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '95%',
    minWidth: '95%',
    maxWidth: '95%',
    padding: '8px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '12px',
    width: '100%',
  };

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({ name, description });
      setName('');
      setDescription('');
      onClose();
    } else {
      alert('Name is required');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div className='modal-workspace-create' style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={closeButtonStyle} onClick={onClose}>
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
          <H level={4} style={{ margin: 0 }}>Create Workspace</H>
        </div>
        <input
          style={inputStyle}
          type="text"
          placeholder="Workspace Name (required)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          style={inputStyle}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* <button style={buttonStyle} onClick={handleCreate}>Create</button> */}
        <Button onClick={handleCreate} text="Create Workspace" color="primary" />
      </div>
    </div>
  );
};

const WorkspaceCard = ({ workspaceId, name, description, role }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-16)',
    padding: '12px 16px',
    marginTop: '8px',
    width: '250px',
    height: '100px',
    boxShadow: 'var(--shadow-light)',
    marginRight: '12px',
    flexShrink: 0,
    cursor: 'pointer',
  };

  const iconStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#d0d0d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '12px',
    fontSize: '24px',
    color: '#ffffff',
  };

  const nameStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  };

  const descStyle = {
    fontSize: '12px',
    color: '#aaa',
    margin: 0,
  };

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      <div style={iconStyle}>{name.charAt(0).toUpperCase()}</div>
      <div>
        <h3 style={nameStyle}>{name}</h3>
        {description && <p style={descStyle}>{description}</p>}
      </div>
    </div>
  );
};

const InputWithSVG = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="input-container">
      <div className="svg-icon">
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#AAAAAA" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search Workspaces"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [showOwned, setShowOwned] = useState(true);
  const [showMember, setShowMember] = useState(true);
  const [showViewer, setShowViewer] = useState(true);

  const filterWorkspaces = (workspaces, role) => {
    return workspaces
      .filter(ws => ws.role === role)
      .filter(ws => ws.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const ownedWorkspaces = filterWorkspaces(workspaces, 'Admin');
  const memberWorkspaces = filterWorkspaces(workspaces, 'Member');
  const viewerWorkspaces = filterWorkspaces(workspaces, 'Viewer');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5137/api/workspaces', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWorkspaces(response.data);

      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (workspaceData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post('http://localhost:5137/api/workspaces', workspaceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdWorkspace = response.data;

      // Add the new workspace to the state with its role
      setWorkspaces((prev) => [
        ...prev,
        {
          workspaceId: createdWorkspace.workspaceId,
          name: createdWorkspace.name,
          description: createdWorkspace.description,
          createdByUserId: createdWorkspace.createdByUserId,
          role: createdWorkspace.role  // This will now contain the role
        }
      ]);

    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const sectionStyle = {
    marginTop: '32px',
    marginBottom: '30px',
  };

  const horizontalScrollStyle = {
    display: 'flex',
    overflowX: 'scroll',
    paddingBottom: '10px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const scrollContainerStyle = {
    display: 'flex',
    gap: '12px',
    paddingBottom: '10px',
  };

  const searchStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    width: '200px',
  };

  const createButtonStyle = {
    background: 'linear-gradient(135deg, #6fa3ef, #89c9f9)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '25px',
    cursor: 'pointer',
  };

  const toggleButtonStyle = {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '20px',
    backgroundColor: 'var(--neutral-100)',
    fontWeight: '500',
    border: '1px solid #ccc',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const toggleVisibility = (section) => {
    if (section === 'owned') {
      setShowOwned((prev) => !prev);
    } else if (section === 'member') {
      setShowMember((prev) => !prev);
    } else if (section === 'viewer') {
      setShowViewer((prev) => !prev);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--ff-poppins)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <H level={3} style={{ margin: 0 }}>Workspaces</H>
        <InputWithSVG searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className='banner-dashboard' style={{
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: '24px 32px',
        borderRadius: 'var(--radius-16)',
      }}>

        {/* Available Workspaces Box aligned under the header/search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          // alignItems: 'center',
          gap: '24px',
          // backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          // padding: '15px',
        }}>
          <div className='banner-content-dashboard' style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Available Workspaces</h3> */}
            <H level={4} style={{ margin: 0 }}>Boost Your Productivity! Create a Workspace and Start Managing Your Projects Seamlessly.</H>
            {/* <p style={{ fontSize: '14px', color: '#888' }}>List of all available workspaces.</p> */}
            <Button onClick={() => setModalOpen(true)}
              iconLeft={<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>} text="Create Workspace" color="primary" />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      {/* Owned Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Owned Workspaces ({ownedWorkspaces.length})
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('owned')}>
            {showOwned ? 'Hide' : 'Show'}
          </button>
        </div>
        {showOwned && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {/* {owned.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))} */}
              {ownedWorkspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.workspaceId}
                  workspaceId={ws.workspaceId}
                  name={ws.name}
                  description={ws.description}
                  role={ws.role}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Member Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Member Workspaces ({memberWorkspaces.length}) {/* Member Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('member')}>
            {showMember ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMember && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {/* {member.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))} */}
              {memberWorkspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.workspaceId}
                  workspaceId={ws.workspaceId}
                  name={ws.name}
                  description={ws.description}
                  role={ws.role}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Viewer Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Viewer Workspaces ({viewerWorkspaces.length}) {/* Viewer Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('viewer')}>
            {showViewer ? 'Hide' : 'Show'}
          </button>
        </div>
        {showViewer && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {/* {viewer.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))} */}
              {viewerWorkspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.workspaceId}
                  workspaceId={ws.workspaceId}
                  name={ws.name}
                  description={ws.description}
                  role={ws.role}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
