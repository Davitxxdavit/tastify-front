import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { ordersApi } from './api';

export const orderKeys = {
    all: ['orders'] as const,
    list: () => [...orderKeys.all, 'list'] as const,
    detail: (orderId: string) => [...orderKeys.all, 'detail', orderId] as const,
};

export function useOrders() {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: orderKeys.list(),
        queryFn: ordersApi.list,
        enabled: isAuthenticated,
    });
}

export function useOrder(orderId: string | undefined) {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: orderKeys.detail(orderId ?? ''),
        queryFn: () => ordersApi.get(orderId!),
        enabled: isAuthenticated && !!orderId,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ordersApi.create,
        onSuccess: (order) => {
            queryClient.setQueryData(orderKeys.detail(order.id), order);
            return queryClient.invalidateQueries({ queryKey: orderKeys.list() });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ordersApi.cancel,
        onSuccess: (order) => {
            queryClient.setQueryData(orderKeys.detail(order.id), order);
            return queryClient.invalidateQueries({ queryKey: orderKeys.list() });
        },
    });
}
