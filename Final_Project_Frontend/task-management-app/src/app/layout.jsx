import React, { useEffect, useState, useRef } from 'react';
import '../styles/layout.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import H from '../components/H.jsx';
import Button from '../components/Button.jsx';

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
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState('Admin');

    useEffect(() => {
        if (show) {
            const fetchUsers = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:5137/api/workspaces/3/users', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        console.error(`Error fetching users: ${response.status} ${response.statusText}`);
                        return;
                    }
                    const data = await response.json().catch(() => {
                        console.error('Error parsing JSON response');
                        return [];
                    });
                    setUsers(data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers();
        }
    }, [show]);

    const handleRemoveUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5137/api/workspaces/3/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error(`Error removing user: ${response.status} ${response.statusText}`);
                return;
            }
            alert('User removed successfully!');
            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5137/api/workspaces/search-users?query=${searchTerm}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error(`Error searching users: ${response.status} ${response.statusText}`);
                return;
            }
            const data = await response.json();
            setSearchResults(data.slice(0, 4)); // Limit to 4 results
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAddUser = async () => {
        if (!selectedUser) {
            alert('Please select a user to add.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5137/api/workspaces/3/users', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: selectedUser.email,
                    role,
                }),
            });
            if (!response.ok) {
                console.error(`Error adding user: ${response.status} ${response.statusText}`);
                return;
            }
            alert('User added successfully!');
            setSelectedUser(null);
            setSearchTerm('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error adding user:', error);
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
                    <InputWithSVG searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <Button onClick={handleSearch} text="Search" color="primary" />
                </div>

                {searchResults.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <H level={4} style={{ marginBottom: '8px' }}>Search Results</H>
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedUser?.id === user.id ? '#f0f8ff' : '#fff',
                                }}
                                onClick={() => setSelectedUser(user)}
                            >
                                <span>{user.fullName} ({user.email})</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            flex: 1,
                        }}
                    >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                    <Button onClick={handleAddUser} text="Add User" color="primary" />
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
                                {(user?.fullName?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ fontWeight: '500' }}>{user?.fullName || 'Unknown User'}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>{user?.role || 'Unknown Role'}</div>
                            </div>
                            <Button
                                onClick={() => handleRemoveUser(user.userId)}
                                text="Remove"
                                color="danger"
                                style={{ marginLeft: 'auto' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [initials, setInitials] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const name = localStorage.getItem('userFullName') || '';
        const email = localStorage.getItem('userEmail') || '';
        setFullName(name);
        setEmail(email);
        const nameParts = name.trim().split(' ');
        const initials = nameParts.map(n => n[0]?.toUpperCase()).slice(0, 2).join('');
        setInitials(initials || 'U');
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5137/api/auth/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userFullName');
        navigate('/');
    };

    const isWorkspacePage = location.pathname.startsWith('/workspace/');

    return (
        <div className="app-container">
            <header className="navbar-layout">
                <Link to="/" className='logo' style={{ marginLeft: '24px' }}>
                    Taskly
                </Link>
                <div className='navbar-right-side'>
                    <div className='notification-circle'>
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                        </svg>
                        <span className="notification-badge"></span>
                    </div>

                    {isWorkspacePage && (
                        <div className='user-control-icon' onClick={() => setShowUserModal(true)}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                    )}

                    <div className='user-circle' onClick={() => setMenuOpen(!menuOpen)}>
                        <p>{initials}</p>
                        {menuOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <div className="initials-circle">{initials}</div>
                                    <div>
                                        <div className="name">{fullName}</div>
                                        <div className="email">{email}</div>
                                        <Link to='/' className='link-view-acc'>View account</Link>
                                    </div>
                                </div>
                                <Button onClick={handleLogout}
                                    iconLeft={<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                    </svg>
                                    } text="Log-out" color="tertiary"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="main-layout">
                <aside className="sidebar">
                    {/* Sidebar nav items go here */}
                </aside>
                <main className="main-content">
                    <Outlet />
                    <UserModal show={showUserModal} onClose={() => setShowUserModal(false)} />
                </main>
            </div>
        </div>
    );
};

export default Layout;
