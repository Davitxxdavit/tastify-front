import { api } from './api';

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
}

export const userService = {
    async getProfile() {
        const response = await api.get<UserProfile>('/users/profile');
        return response.data;
    },

    async updateProfile(data: Partial<UserProfile>) {
        // Note: Backend may not support profile updates yet
        const response = await api.put<UserProfile>('/users/profile', data);
        return response.data;
    },

    async getAddresses() {
        const response = await api.get<Address[]>('/users/addresses');
        return response.data;
    },

    async createAddress(data: Omit<Address, 'id'>) {
        const response = await api.post<Address>('/users/addresses', data);
        return response.data;
    },

    async deleteAddress(addressId: string) {
        await api.delete(`/users/addresses/${addressId}`);
    },
};
