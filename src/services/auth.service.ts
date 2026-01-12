import { api } from './api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const authService = {
    async register(data: any) {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: any) {
        const response = await api.post<AuthResponse>('/auth/login', data);
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken); // If used
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    async getProfile() {
        const response = await api.get<User>('/users/me');
        return response.data;
    }
};
