import { useMatch } from 'react-router-dom';
import { useOrders } from '../orders/hooks';
import { TERMINAL_STATUSES } from '../orders/types';

/**
 * Chat is per order on the backend. Use the order being viewed, otherwise the
 * customer's most recent order that's still in progress.
 */
export function useChatOrder() {
    const match = useMatch('/orders/:orderId');
    const orders = useOrders();
    const viewedId = match?.params.orderId;

    if (viewedId) {
        return { orderId: viewedId, isLoading: false };
    }
    // GET /orders is sorted newest first
    const active = orders.data?.find((order) => !TERMINAL_STATUSES.includes(order.status));
    return { orderId: active?.id, isLoading: orders.isPending && orders.fetchStatus !== 'idle' };
}
