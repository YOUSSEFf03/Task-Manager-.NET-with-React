import React, { useState } from 'react';
import H from '../components/H';
import Button from '../components/Button';
import '../styles/inputSearch.css';
import backgroundImage from "../assets/Group 285.png";
import '../styles/dashboard.css';

const WorkspaceCard = ({ name, description }) => {
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
    <div style={cardStyle}>
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
  const owned = [
    { name: 'Alpha', description: 'Owned workspace' },
    { name: 'Delta', description: 'This is another workspace' },
    { name: 'Delta', description: 'This is another workspace' },
    { name: 'Delta', description: 'This is another workspace' },
    { name: 'Delta', description: 'This is another workspace' },
  ];
  const member = [{ name: 'Beta' }];
  const viewer = [{ name: 'Gamma' }];
  const [searchTerm, setSearchTerm] = useState('');
  const [showOwned, setShowOwned] = useState(true);
  const [showMember, setShowMember] = useState(true);
  const [showViewer, setShowViewer] = useState(true);

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
    <div style={{ fontFamily: 'var(--ff-poppins)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <H level={2} style={{ margin: 0 }}>Workspaces</H>
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
            <Button
              iconLeft={<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>} text="Create Workspace" color="primary" />
          </div>
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
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {owned.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Member Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Member Workspaces ({member.length}) {/* Member Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('member')}>
            {showMember ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMember && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {member.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Viewer Workspaces Section */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <H level={4} style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
            Viewer Workspaces ({viewer.length}) {/* Viewer Workspaces Header */}
          </H>
          <button style={toggleButtonStyle} onClick={() => toggleVisibility('viewer')}>
            {showViewer ? 'Hide' : 'Show'}
          </button>
        </div>
        {showViewer && (
          <div style={horizontalScrollStyle}>
            <div style={scrollContainerStyle}>
              {viewer.map((ws, idx) => (
                <WorkspaceCard key={idx} {...ws} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
