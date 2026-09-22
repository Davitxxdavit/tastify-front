import type { OrderStatus } from './types';

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; description: string; badgeClass: string }> = {
    PENDING: {
        label: 'Received',
        description: 'The restaurant has your order.',
        badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    },
    PREPARING: {
        label: 'Preparing',
        description: 'The kitchen is cooking your food.',
        badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    READY: {
        label: 'Ready',
        description: 'Packed and waiting for the courier.',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    DELIVERING: {
        label: 'On the way',
        description: 'The courier is heading to you.',
        badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    },
    COMPLETED: {
        label: 'Delivered',
        description: 'Enjoy your meal!',
        badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    CANCELLED: {
        label: 'Cancelled',
        description: 'This order was cancelled.',
        badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
};
