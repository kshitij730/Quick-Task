import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut, CheckSquare, LayoutDashboard, User,
    Bell, Sun, Moon, AlertTriangle, Clock
} from 'lucide-react';
import { taskService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [notifications, setNotifications] = useState({ upcomingTasks: [], overdueTasks: [] });
    const [showNotifPanel, setShowNotifPanel] = useState(false);

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await taskService.getNotifications();
            setNotifications(res.data.data);
        } catch (error) {
            console.error('Notif error', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // 5 mins
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!user) return null;

    const totalNotifs = notifications.overdueTasks.length + notifications.upcomingTasks.length;

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <CheckSquare color="#6366f1" size={28} />
                <span>QuickTask</span>
            </div>
            <div className="nav-links">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <CheckSquare size={20} />
                    <span>Tasks</span>
                </NavLink>
            </div>

            <div className="nav-actions">
                <button onClick={toggleTheme} className="action-icon-btn">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="notif-wrapper">
                    <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="action-icon-btn">
                        <Bell size={20} />
                        {totalNotifs > 0 && <span className="notif-badge">{totalNotifs}</span>}
                    </button>

                    {showNotifPanel && (
                        <div className="notif-panel glass-card">
                            <div className="notif-header">Notifications</div>
                            <div className="notif-list">
                                {notifications.overdueTasks.length > 0 && (
                                    <div className="notif-section">
                                        <div className="section-title overdue"><AlertTriangle size={14} /> Overdue</div>
                                        {notifications.overdueTasks.map(t => (
                                            <div key={t._id} className="notif-item">{t.title}</div>
                                        ))}
                                    </div>
                                )}
                                {notifications.upcomingTasks.length > 0 && (
                                    <div className="notif-section">
                                        <div className="section-title upcoming"><Clock size={14} /> Due Soon</div>
                                        {notifications.upcomingTasks.map(t => (
                                            <div key={t._id} className="notif-item">{t.title}</div>
                                        ))}
                                    </div>
                                )}
                                {totalNotifs === 0 && <div className="notif-empty">No new alerts</div>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="nav-user">
                    <div className="user-info">
                        <User size={18} />
                        <span>{user.email.split('@')[0]}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
