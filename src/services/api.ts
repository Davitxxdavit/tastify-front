import axios from 'axios';

const API_URL = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3000';

export const api = axios.create({
    baseURL: `${API_URL}/api/v1`, // Matches backend global prefix
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies if needed, though JWT usually in header
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            // Optional: Redirect to login
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);
