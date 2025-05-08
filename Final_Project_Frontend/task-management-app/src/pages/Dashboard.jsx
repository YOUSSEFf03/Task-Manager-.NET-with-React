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
        <Button onClick={handleCreate} text="Create Workspace" color="primary" />
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
      }}>
        <h3>Are you sure you want to delete this workspace?</h3>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button onClick={onDelete} text="Delete" color="tertiary" />
          <Button onClick={onClose} text="Cancel" color="primary" />
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, onEdit, workspace }) => {
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');

  const handleEdit = () => {
    if (name.trim()) {
      onEdit({ ...workspace, name, description });
      onClose();
    } else {
      alert('Name is required');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}>
        <button style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
        }} onClick={onClose}>
          &times;
        </button>
        <H level={4} style={{ margin: 0 }}>Edit Workspace</H>
        <input
          style={{ width: '95%', padding: '8px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'var(--ff-poppins)' }}
          type="text"
          placeholder="Workspace Name (required)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          style={{ width: '95%', maxWidth: "95%", minWidth: "95%", padding: '8px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'var(--ff-poppins)' }}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleEdit} text="Save Changes" color="primary" />
      </div>
    </div>
  );
};

const WorkspaceCard = ({ workspaceId, name, description, role, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <div
      style={{
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
      }}
      onClick={handleCardClick} // Trigger navigation on click
    >
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--tertiary-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '12px',
        fontSize: '24px',
        color: '#ffffff',
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>{name}</h3>
        {description && <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{description}</p>}
      </div>
      {role === 'Admin' && (
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
          <svg onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            onEdit(workspaceId);
          }}
            class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path className='workspace-svg' stroke="var(--neutral-700)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
          </svg>
          <svg onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            onDelete(workspaceId);
          }}
            class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path className='workspace-svg' stroke="var(--neutral-700)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
          </svg>
        </div>
      )}
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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);
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
    if (!token) {
      console.error("No token found in localStorage.");
      alert("You must be logged in to create a workspace.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5137/api/workspaces', workspaceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 201 && response.status !== 200) {
        console.error(`Unexpected response status: ${response.status}`);
        console.error("Response data:", response.data);
        alert("Failed to create workspace. Please try again.");
        return;
      }

      const createdWorkspace = response.data;

      // Add the new workspace to the state
      setWorkspaces((prev) => [
        ...prev,
        {
          workspaceId: createdWorkspace.workspaceId,
          name: createdWorkspace.name,
          description: createdWorkspace.description,
          createdByUserId: createdWorkspace.createdByUserId,
          role: createdWorkspace.role, // This will now contain the role
        },
      ]);

    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to create workspace."}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your network connection.");
      } else {
        console.error("Error creating workspace:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    const token = localStorage.getItem('token');
    if (!token || !workspaceToDelete) {
      console.error("No token found or no workspace selected.");
      alert("You must be logged in to delete a workspace.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5137/api/workspaces/${workspaceToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted workspace from the state
      setWorkspaces((prev) => prev.filter((ws) => ws.workspaceId !== workspaceToDelete));
      setDeleteModalOpen(false);
      setWorkspaceToDelete(null);
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to delete workspace."}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your network connection.");
      } else {
        console.error("Error deleting workspace:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleEditWorkspace = async (updatedWorkspace) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage.");
      alert("You must be logged in to edit a workspace.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5137/api/workspaces/${updatedWorkspace.workspaceId}`,
        updatedWorkspace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        console.error(`Unexpected response status: ${response.status}`);
        alert("Failed to edit workspace. Please try again.");
        return;
      }

      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.workspaceId === updatedWorkspace.workspaceId ? updatedWorkspace : ws
        )
      );
    } catch (error) {
      console.error("Error editing workspace:", error);
      alert("An unexpected error occurred. Please try again.");
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

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          gap: '24px',
        }}>
          <div className='banner-content-dashboard' style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <H level={4} style={{ margin: 0 }}>Boost Your Productivity! Create a Workspace and Start Managing Your Projects Seamlessly.</H>
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setWorkspaceToDelete(null);
        }}
        onDelete={handleDeleteWorkspace}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleEditWorkspace}
        workspace={workspaces.find((ws) => ws.workspaceId === workspaceToEdit)}
      />

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
              {ownedWorkspaces.map((ws) => (
                <WorkspaceCard
                  key={ws.workspaceId}
                  workspaceId={ws.workspaceId}
                  name={ws.name}
                  description={ws.description}
                  role={ws.role}
                  onDelete={(workspaceId) => {
                    setWorkspaceToDelete(workspaceId);
                    setDeleteModalOpen(true);
                  }}
                  onEdit={(workspaceId) => {
                    setWorkspaceToEdit(workspaceId);
                    setEditModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Member Workspaces ({memberWorkspaces.length})
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('member')}>
            {showMember ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMember && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
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

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Viewer Workspaces ({viewerWorkspaces.length})
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('viewer')}>
            {showViewer ? 'Hide' : 'Show'}
          </button>
        </div>
        {showViewer && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
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
