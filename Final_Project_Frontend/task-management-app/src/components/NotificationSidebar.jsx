import React, { useEffect, useState } from 'react';
import '../styles/notificationSidebar.css';

const NotificationSidebar = ({ isOpen, onClose, updateUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5137/api/notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setNotifications(data);
            const unread = data.filter((notification) => !notification.isRead).length;
            // setUnreadCount(unread);
            updateUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5137/api/notifications/${notificationId}/mark-as-read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setNotifications((prev) => prev.map((notification) =>
                notification.notificationId === notificationId ? { ...notification, isRead: true } : notification
            ));
            // setUnreadCount((prev) => prev - 1);
            const unread = notifications.filter((notification) => !notification.isRead).length - 1;
            updateUnreadCount(unread);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`notification-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="notification-header">
                <h2>Notifications</h2>
                {/* <button onClick={onClose}>&times;</button> */}
                <svg style={{ cursor: "pointer" }} onClick={onClose} class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p>No notifications</p>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                            onClick={() => markAsRead(notification.notificationId)}
                        >
                            <div className="notification-title">{notification.notificationType}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-date">{new Date(notification.createdAt).toLocaleString()}</div>
                            {!notification.isRead && <div className="notification-indicator"></div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationSidebar;