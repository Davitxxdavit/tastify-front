import { api } from './api';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    isAvailable: boolean;
}

export const productService = {
    async getAll() {
        const response = await api.get<Product[]>('/menu/items');
        return response.data;
    },

    async getByCategory(categoryId: string) {
        const response = await api.get<Product[]>(`/menu/items?categoryId=${categoryId}`);
        return response.data;
    }
};
