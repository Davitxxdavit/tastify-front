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
        // Backend endpoint assumed to be /products or /items
        const response = await api.get<Product[]>('/products');
        // Need to verify backend endpoint for products. 
        // Based on "Burger API", usually /products or /burgers
        return response.data;
    }
};
