// src/services/mockApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // Replace with your backend URL

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;

export const api = {
  // Auth endpoints
  login: (credentials) => 
    axios.post('/login', credentials).then((res) => res.data),
  register: (userData) => 
    axios.post('/register', userData).then((res) => res.data),
  logout: () => 
    axios.post('/logout').then((res) => res.data),
  getProfile: () => 
    axios.get('/profile').then((res) => res.data),
  getAllUsers: () =>
    axios.get('/all-users').then((res) => res.data),

  // Task endpoints
  getTasks: () => 
    axios.get('/tasks').then((res) => res.data),
  createTask: (task) => 
    axios.post('/tasks', task).then((res) => res.data),
  updateTask: (id, updates) => 
    axios.put(`/tasks/${id}`, updates).then((res) => res.data),
  deleteTask: (id) => 
    axios.delete(`/tasks/${id}`).then((res) => res.data),

  // Analytics endpoints
  getAnalytics: (days) =>
    axios.get(`/analytics?days=${days}`).then((res) => res.data),
};
