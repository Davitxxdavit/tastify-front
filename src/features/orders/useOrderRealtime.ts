import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { acquireSocket, joinRoom, releaseSocket } from '../../lib/realtime/socket';
import { useAuth } from '../auth/useAuth';
import { orderKeys } from './hooks';
import { applyStatusUpdate, ORDER_STATUS_EVENTS, statusFromEvent, type OrderEventPayload } from './realtime';
import type { Order } from './types';

/**
 * Subscribes to live status changes for one order over the /orders namespace.
 * Events patch the TanStack Query cache immediately, then trigger a refetch
 * for the authoritative order (history timestamps, courier, etc.).
 */
export function useOrderRealtime(orderId: string | undefined) {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!orderId || !isAuthenticated) return;

        const socket = acquireSocket('/orders');
        let hasJoined = false;

        const join = async () => {
            const result = await joinRoom(socket, 'join_order_room', { orderId });
            if (result.error) {
                console.warn(`Couldn't subscribe to order ${orderId}: ${result.error}`);
                return;
            }
            // After a reconnect we may have missed events while offline
            if (hasJoined) {
                queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
                queryClient.invalidateQueries({ queryKey: orderKeys.list() });
            }
            hasJoined = true;
        };

        const handlers = Object.keys(ORDER_STATUS_EVENTS).map((event) => {
            const handler = (payload: OrderEventPayload) => {
                if (payload?.orderId !== orderId) return;
                const status = statusFromEvent(event, payload);
                if (!status) return;

                const at = new Date().toISOString();
                queryClient.setQueryData<Order>(orderKeys.detail(orderId), (order) =>
                    order ? applyStatusUpdate(order, status, at) : order,
                );
                queryClient.setQueryData<Order[]>(orderKeys.list(), (orders) =>
                    orders?.map((order) => (order.id === orderId ? { ...order, status } : order)),
                );
                queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
            };
            socket.on(event, handler);
            return [event, handler] as const;
        });

        socket.on('connect', join);
        if (socket.connected) join();

        return () => {
            socket.off('connect', join);
            handlers.forEach(([event, handler]) => socket.off(event, handler));
            if (socket.connected) socket.emit('leave_order_room', { orderId });
            releaseSocket('/orders');
        };
    }, [orderId, isAuthenticated, queryClient]);
}
