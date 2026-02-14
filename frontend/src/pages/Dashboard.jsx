import React, { useState, useEffect } from 'react';
import { taskService, analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    LineChart, Line, CartesianGrid
} from 'recharts';
import {
    CheckCircle2, Clock, ListChecks, Target,
    TrendingUp, AlertTriangle, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [summaryRes, statsRes, trendsRes] = await Promise.all([
                    taskService.getSummary(),
                    analyticsService.getStats(user._id),
                    analyticsService.getTrends(user._id, 7)
                ]);

                setSummary(summaryRes.data.data);
                setStats(statsRes.data);
                setTrends(trendsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="loading-container">Analyzing your productivity...</div>;

    const priorityData = summary?.priorityDistribution?.map(p => ({
        name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
        value: p.count
    })) || [];

    const COLORS = ['#6366f1', '#f59e0b', '#ef4444'];

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Insights into your productivity and tasks</p>
            </div>

            <div className="stats-grid">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card glass-card">
                    <div className="stat-icon total"><ListChecks size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Tasks</h3>
                        <p className="stat-value">{summary?.totalTasks || 0}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card glass-card">
                    <div className="stat-icon completed"><CheckCircle2 size={24} /></div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p className="stat-value">{summary?.completedTasks || 0}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card glass-card">
                    <div className="stat-icon progress"><Clock size={24} /></div>
                    <div className="stat-info">
                        <h3>Pending</h3>
                        <p className="stat-value">{summary?.pendingTasks || 0}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card glass-card">
                    <div className="stat-icon score"><Target size={24} /></div>
                    <div className="stat-info">
                        <h3>Productivity</h3>
                        <p className="stat-value">{stats?.productivity_score || 0}%</p>
                    </div>
                </motion.div>
            </div>

            <div className="charts-grid">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="chart-card glass-card">
                    <h3>Task Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-legend">
                        {priorityData.map((entry, index) => (
                            <div key={entry.name} className="legend-item">
                                <span className="bullet" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="chart-card glass-card">
                    <h3>Completion Trend (7 Days)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="advanced-stats">
                <div className="insight-card glass-card">
                    <div className="insight-header">
                        <TrendingUp size={20} color="#10b981" />
                        <span>Efficiency Insight</span>
                    </div>
                    <div className="insight-body">
                        <p>Your average completion time per task is <strong>{stats?.avg_completion_time_hrs || 0} hours</strong>.</p>
                    </div>
                </div>

                <div className="insight-card glass-card">
                    <div className="insight-header">
                        <AlertTriangle size={20} color="#ef4444" />
                        <span>Risk Analysis</span>
                    </div>
                    <div className="insight-body">
                        <p>You have <strong>{stats?.overdue_tasks || 0} overdue tasks</strong> that need your immediate attention.</p>
                    </div>
                </div>

                <div className="insight-card glass-card">
                    <div className="insight-header">
                        <Calendar size={20} color="#f59e0b" />
                        <span>Progress</span>
                    </div>
                    <div className="insight-body">
                        <p>You have completed <strong>{summary?.completedTasks || 0} tasks</strong> this period.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
