import { api } from './api';

export interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
}

export const categoriesService = {
    async getAll() {
        const response = await api.get<Category[]>('/menu/categories');
        return response.data;
    }
};
