import type { Order, OrderStatus } from './types';

export type TimelineStepState = 'done' | 'current' | 'upcoming';

export interface TimelineStep {
    status: OrderStatus;
    state: TimelineStepState;
    /** When the order entered this status, if known. */
    at: string | null;
}

// Happy path, matching the backend's allowed transitions
export const STATUS_FLOW: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'];

/** Builds the progress timeline for an order from its status and history. */
export function buildTimeline(order: Pick<Order, 'status' | 'createdAt' | 'statusHistory'>): TimelineStep[] {
    const history = order.statusHistory ?? [];
    // Latest entry wins when a status appears twice
    const enteredAt = (status: OrderStatus) =>
        history
            .filter((entry) => entry.status === status)
            .map((entry) => entry.changedAt)
            .sort()
            .at(-1) ?? (status === 'PENDING' ? order.createdAt : null);

    if (order.status === 'CANCELLED') {
        // Show how far it got, then the cancellation
        const reached = STATUS_FLOW.filter((status) => enteredAt(status) !== null);
        return [
            ...reached.map((status) => ({ status, state: 'done' as const, at: enteredAt(status) })),
            { status: 'CANCELLED', state: 'current', at: enteredAt('CANCELLED') },
        ];
    }

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    return STATUS_FLOW.map((status, index) => ({
        status,
        state: index < currentIndex ? 'done' : index === currentIndex ? (status === 'COMPLETED' ? 'done' : 'current') : 'upcoming',
        at: index <= currentIndex ? enteredAt(status) : null,
    }));
}
