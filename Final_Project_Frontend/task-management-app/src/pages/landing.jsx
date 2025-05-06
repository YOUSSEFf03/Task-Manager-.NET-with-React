import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/landing.css';
import H from '../components/H.jsx';
import Button from '../components/Button.jsx';

export default function Landing() {
    return (
        <div>
            <header>
                <nav className='navbar'>
                    <Link to="/" className='logo'>
                        Taskly
                    </Link>
                    <ul className='navbar-list'>
                        <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'selected' : ''}`}>Home</NavLink></li>
                        <li><NavLink to="/x" className={({ isActive }) => `nav-link ${isActive ? 'selected' : ''}`}>Product</NavLink></li>
                        <li><NavLink to="/y" className={({ isActive }) => `nav-link ${isActive ? 'selected' : ''}`}>About Us</NavLink></li>
                        <li><NavLink to="/z" className={({ isActive }) => `nav-link ${isActive ? 'selected' : ''}`}>Contact Us</NavLink></li>
                    </ul>
                    <div className='btn-header'>
                        <Link to="/login" className='btn-link'>
                            <Button text="Sign-in" color="tertiary" />
                        </Link>
                        <Link to="/signup" className='btn-link'>
                            <Button
                                iconLeft={<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>} text="Sign-up" color="primary" />
                        </Link>
                    </div>
                </nav>
            </header>
            <div className='hero'>
                <div className="hero-content">
                    <H level={1}>
                        Seamless Task Management for
                        Teams and Individuals
                    </H>
                    <p className="hero-subtitle">
                        In today’s fast-paced world, staying organized and on track can be challenging,
                        whether you’re working alone or as part of a team.
                    </p>
                    <form className="hero-form">
                        <input type="email" placeholder="Enter your email" className="hero-input" />
                        <Button
                            iconRight={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" stroke-width="1.5" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                            </svg>}
                            text="Try It Free" color="primary" />
                    </form>
                </div>
            </div>
        </div>
    );
}
