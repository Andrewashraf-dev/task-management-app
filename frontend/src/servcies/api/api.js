import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => API.post('/register', userData),
    login: (credentials) => API.post('/login', credentials),
    logout: () => API.post('/logout'),
    getUser: () => API.get('/user'),
};

export const taskAPI = {
    getTasks: () => API.get('/tasks'),
    createTask: (taskData) => API.post('/tasks', taskData),
    updateTask: (id, taskData) => API.put(`/tasks/${id}`, taskData),
    deleteTask: (id) => API.delete(`/tasks/${id}`),
};

export default API;