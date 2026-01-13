import { api } from './api';

export interface OrderItem {
    menuItemId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
    deliveryAddressId?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderDto {
    items: OrderItem[];
    deliveryAddressId?: string;
    notes?: string;
}

export const ordersService = {
    async createOrder(data: CreateOrderDto) {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    async getMyOrders() {
        const response = await api.get<Order[]>('/orders');
        return response.data;
    },

    async getOrderById(orderId: string) {
        const response = await api.get<Order>(`/orders/${orderId}`);
        return response.data;
    },

    async cancelOrder(orderId: string) {
        const response = await api.patch<Order>(`/orders/${orderId}/cancel`);
        return response.data;
    },
};
