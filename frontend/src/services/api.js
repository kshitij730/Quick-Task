import axios from 'axios';

const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000/analytics';

const api = axios.create({
    baseURL: NODE_API_URL,
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (userData) => api.post('/auth/login', userData),
    getMe: () => api.get('/auth/me'),
};

export const taskService = {
    getTasks: (params) => api.get('/tasks', { params }),
    getTask: (id) => api.get(`/tasks/${id}`),
    createTask: (taskData) => api.post('/tasks', taskData),
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    getSummary: () => api.get('/tasks/dashboard/summary'),
    getNotifications: () => api.get('/tasks/notifications'),
};

export const analyticsService = {
    getStats: (userId) => axios.get(`${PYTHON_API_URL}/stats/${userId}`),
    getTrends: (userId, days = 7) => axios.get(`${PYTHON_API_URL}/trends/${userId}?days=${days}`),
};

export default api;
