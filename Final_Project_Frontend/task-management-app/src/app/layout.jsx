import React, { useEffect, useState, useRef } from 'react';
import '../styles/layout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import H from '../components/H.jsx';
import Button from '../components/Button.jsx';

const Layout = () => {
    const navigate = useNavigate();
    const [initials, setInitials] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
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
                </main>
            </div>
        </div>
    );
};

export default Layout;
