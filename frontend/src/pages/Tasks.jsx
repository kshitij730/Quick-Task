import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { Plus, Search, Filter, SortAsc, MoreVertical, Trash2, Edit2, Calendar, Clock, AlertCircle } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import './Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
        sort: 'createdAt:desc'
    });
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await taskService.getTasks(filters);
            setTasks(res.data.data);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await taskService.updateTaskStatus(id, newStatus);
            fetchTasks();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task', error);
            }
        }
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleExport = (type) => {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams(filters).toString();
        const baseUrl = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';
        const url = `${baseUrl}/export/${type}?${queryParams}&token=${token}`;

        // Use a hidden anchor to trigger download instead of window.open
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tasks-export.${type}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="tasks-page">
            <div className="tasks-header">
                <div className="header-title">
                    <h1>My Tasks</h1>
                    <p>Manage and organize your daily work</p>
                </div>
                <div className="header-actions">
                    <div className="export-dropdown">
                        <button
                            className="btn-secondary"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            Export
                        </button>
                        {showExportMenu && (
                            <div className="export-menu glass-card">
                                <button onClick={() => { handleExport('csv'); setShowExportMenu(false); }}>CSV Spreadsheet</button>
                                <button onClick={() => { handleExport('pdf'); setShowExportMenu(false); }}>PDF Document</button>
                            </div>
                        )}
                    </div>
                    <button className="add-task-btn" onClick={() => { setSelectedTask(null); setShowModal(true); }}>
                        <Plus size={20} />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            <div className="tasks-filters glass-card">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <select
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    >
                        <option value="createdAt:desc">Newest First</option>
                        <option value="dueDate:asc">Near Due Date</option>
                        <option value="priority:desc">High Priority First</option>
                    </select>
                </div>
            </div>

            <div className="tasks-list">
                {loading ? (
                    <div className="loading-state">Loading your tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state glass-card">
                        <AlertCircle size={48} />
                        <h3>No tasks found</h3>
                        <p>Try adjusting your filters or create a new task to get started.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="task-item glass-card"
                            >
                                <div className="task-content">
                                    <div className="task-main">
                                        <input
                                            type="checkbox"
                                            className="task-checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleStatusChange(task._id, task.status === 'completed' ? 'todo' : 'completed')}
                                        />
                                        <div className="task-info">
                                            <h3 className={task.status === 'completed' ? 'completed-text' : ''}>{task.title}</h3>
                                            <p>{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="task-meta">
                                        <div className="task-tags">
                                            <span className="priority-tag" style={{ backgroundColor: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority) }}>
                                                {task.priority}
                                            </span>
                                            {task.dueDate && (
                                                <span className="due-tag">
                                                    <Calendar size={14} />
                                                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="task-actions">
                                            <button onClick={() => openEditModal(task)} className="action-btn edit"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(task._id)} className="action-btn delete"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {showModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); fetchTasks(); }}
                />
            )}
        </div>
    );
};

export default Tasks;
