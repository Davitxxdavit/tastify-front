import { orderStatusSchema, type Order, type OrderStatus } from './types';

/**
 * Events the /orders gateway emits to room `order:<id>`. Today the backend only
 * emits `order_updated` for status changes; the per-status events are declared
 * in the gateway but never called. Handle them anyway so the UI keeps working if
 * they are wired up.
 */
export const ORDER_STATUS_EVENTS: Record<string, OrderStatus | null> = {
    order_updated: null, // payload carries the status
    order_cancelled: 'CANCELLED',
    order_ready: 'READY',
    order_delivering: 'DELIVERING',
    order_completed: 'COMPLETED',
};

export interface OrderEventPayload {
    orderId: string;
    status?: string;
}

/** Resolves the new status from an event, or null if the payload is unusable. */
export function statusFromEvent(event: string, payload: OrderEventPayload): OrderStatus | null {
    const fixed = ORDER_STATUS_EVENTS[event];
    if (fixed) return fixed;
    const parsed = orderStatusSchema.safeParse(payload.status);
    return parsed.success ? parsed.data : null;
}

/**
 * Optimistically applies a status change to a cached order, adding a history
 * entry so the timeline shows the step right away (the refetch replaces it).
 */
export function applyStatusUpdate(order: Order, status: OrderStatus, at: string): Order {
    if (order.status === status) return order;
    const history = order.statusHistory ?? [];
    return {
        ...order,
        status,
        statusHistory: [
            { id: `live-${status}`, orderId: order.id, status, changedAt: at, changedBy: null, notes: null },
            ...history,
        ],
    };
}
