import { api } from '../../lib/http/api-client';
import { parseResponse } from '../../lib/http/parse';
import { orderSchema, ordersSchema, type CreateOrderRequest, type Order } from './types';

export const ordersApi = {
    async list(): Promise<Order[]> {
        const { data } = await api.get<unknown>('/orders');
        return parseResponse(ordersSchema, data, 'orders');
    },

    async get(orderId: string): Promise<Order> {
        const { data } = await api.get<unknown>(`/orders/${orderId}`);
        return parseResponse(orderSchema, data, 'order');
    },

    async create(body: CreateOrderRequest): Promise<Order> {
        const { data } = await api.post<unknown>('/orders', body);
        return parseResponse(orderSchema, data, 'order');
    },

    async cancel(orderId: string): Promise<Order> {
        const { data } = await api.patch<unknown>(`/orders/${orderId}/cancel`);
        return parseResponse(orderSchema, data, 'order');
    },
};
