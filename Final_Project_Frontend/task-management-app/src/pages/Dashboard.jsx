import React, { useState } from 'react';
import H from '../components/H'; // Assuming this is the correct path
import Button from '../components/Button';

const WorkspaceCard = ({ name, description }) => {
  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    // background: 'linear-gradient(135deg, #f9f9f9, #e0e0e0)',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '8px',
    width: '250px',
    height: '100px',
    boxShadow: 'var(--shadow-1)',
    marginRight: '12px',
    flexShrink: 0,
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
    <div style={cardStyle}>
      <div style={iconStyle}>{name.charAt(0).toUpperCase()}</div>
      <div>
        <h3 style={nameStyle}>{name}</h3>
        {description && <p style={descStyle}>{description}</p>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const owned = [
    { name: 'Alpha', description: 'Owned workspace' },
    { name: 'Delta', description: 'This is another workspace' },
  ];
  const member = [{ name: 'Beta' }];
  const viewer = [{ name: 'Gamma' }];
  const [searchTerm, setSearchTerm] = useState('');
  const [showOwned, setShowOwned] = useState(true);
  const [showMember, setShowMember] = useState(true);
  const [showViewer, setShowViewer] = useState(true);

  const sectionStyle = {
    marginBottom: '30px',
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
    padding: '5px 12px',
    fontSize: '14px',
    borderRadius: '20px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontWeight: '600',
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Hero section */}
      {/* Hero Section with Header and Search on the same line */}
      <div style={{
        background: 'linear-gradient(135deg, #f4c7e1, #b5a4d9)', // Lavender Pink gradient
        margin: '8px',
        padding: '24px 32px',
        borderRadius: '8px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <H level={1} style={{ margin: 0 }}>Workspaces</H>
          <input
            type="text"
            style={searchStyle}
            placeholder="Search workspaces"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

  {/* Available Workspaces Box aligned under the header/search */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '15px',
  }}>
    <div style={{ width: '70%' }}>
      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Available Workspaces</h3>
      <p style={{ fontSize: '14px', color: '#888' }}>List of all available workspaces.</p>
    </div>
    <Button
                                iconLeft={<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>} text="Create Workspace" color="primary" />
  </div>
</div>


      {/* Owned Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Owned Workspaces ({owned.length}) {/* Owned Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('owned')}>
            {showOwned ? 'Hide' : 'Show'}
          </button>
        </div>
        {showOwned && (
          <div style={{ display: 'flex', overflowX: 'scroll', marginTop: '10px' }}>
            {owned.map((ws, idx) => (
              <WorkspaceCard key={idx} {...ws} />
            ))}
          </div>
        )}
      </div>

      {/* Member Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={2} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Member Workspaces ({member.length}) {/* Member Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('member')}>
            {showMember ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMember && (
          <div style={{ display: 'flex', overflowX: 'scroll', marginTop: '10px' }}>
            {member.map((ws, idx) => (
              <WorkspaceCard key={idx} {...ws} />
            ))}
          </div>
        )}
      </div>

      {/* Viewer Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={2} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Viewer Workspaces ({viewer.length}) {/* Viewer Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('viewer')}>
            {showViewer ? 'Hide' : 'Show'}
          </button>
        </div>
        {showViewer && (
          <div style={{ display: 'flex', overflowX: 'scroll', marginTop: '10px' }}>
            {viewer.map((ws, idx) => (
              <WorkspaceCard key={idx} {...ws} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
