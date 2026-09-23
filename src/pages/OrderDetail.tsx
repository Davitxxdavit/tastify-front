import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, StickyNote } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCancelOrder, useOrder } from '../features/orders/hooks';
import { useOrderRealtime } from '../features/orders/useOrderRealtime';
import { ORDER_STATUS_META } from '../features/orders/status';
import { StatusTimeline } from '../features/orders/components/StatusTimeline';
import { TERMINAL_STATUSES } from '../features/orders/types';
import { LiveIndicator } from '../components/LiveIndicator';
import { Badge } from '../components/ui/Badge';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { toApiError } from '../lib/http/api-error';
import { formatDateTime, formatGel } from '../lib/format';

export default function OrderDetail() {
    const { orderId } = useParams<{ orderId: string }>();
    const { data: order, isPending, isError, error, refetch, isRefetching } = useOrder(orderId);
    const cancelOrder = useCancelOrder();
    const [confirmingCancel, setConfirmingCancel] = useState(false);
    useOrderRealtime(orderId);

    if (isPending) {
        return (
            <div className="container mx-auto max-w-5xl px-4 py-10 space-y-6" aria-busy="true" aria-label="Loading order">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 lg:grid-cols-5">
                    <Skeleton className="h-80 lg:col-span-3" />
                    <Skeleton className="h-80 lg:col-span-2" />
                </div>
            </div>
        );
    }

    if (isError) {
        const notFound = toApiError(error).status === 404;
        return (
            <div className="container mx-auto max-w-5xl px-4 py-10">
                {notFound ? (
                    <div className="py-16 text-center">
                        <h1 className="font-serif text-2xl font-bold">Order not found</h1>
                        <p className="mt-2 text-gray-400">It may belong to another account.</p>
                        <Link to="/orders" className="mt-6 inline-block text-primary-bright underline">
                            Back to my orders
                        </Link>
                    </div>
                ) : (
                    <ErrorState title="Couldn't load this order" error={error} onRetry={() => refetch()} isRetrying={isRefetching} />
                )}
            </div>
        );
    }

    const status = ORDER_STATUS_META[order.status];
    const isActive = !TERMINAL_STATUSES.includes(order.status);

    const handleCancel = async () => {
        try {
            await cancelOrder.mutateAsync(order.id);
            toast.success('Your order was cancelled');
        } catch (err) {
            toast.error(toApiError(err).message);
        } finally {
            setConfirmingCancel(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-10 text-white">
            <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                My orders
            </Link>

            <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 mb-8 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="font-serif text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Placed {formatDateTime(order.createdAt)}
                        {order.scheduledFor && <> · Scheduled for {formatDateTime(order.scheduledFor)}</>}
                    </p>
                </div>
                <Badge className={status.badgeClass}>{status.label}</Badge>
                {isActive && <LiveIndicator namespace="/orders" />}
            </motion.header>

            <div className="grid gap-6 lg:grid-cols-5">
                <section aria-labelledby="progress-heading" className="rounded-lg border border-surface-border bg-card-dark p-6 lg:col-span-2">
                    <h2 id="progress-heading" className="mb-6 text-sm font-semibold uppercase tracking-wide text-text-muted">
                        Progress
                    </h2>
                    <StatusTimeline order={order} />

                    {order.status === 'PENDING' && (
                        <div className="mt-8 border-t border-surface-border pt-6">
                            {confirmingCancel ? (
                                <div role="group" aria-label="Confirm cancellation" className="space-y-3">
                                    <p className="text-sm text-gray-300">Cancel this order?</p>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={cancelOrder.isPending}
                                            className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                                        >
                                            {cancelOrder.isPending ? 'Cancelling…' : 'Yes, cancel'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmingCancel(false)}
                                            className="rounded border border-surface-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white"
                                        >
                                            Keep order
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmingCancel(true)}
                                    className="text-sm text-gray-400 underline hover:text-red-300"
                                >
                                    Cancel order
                                </button>
                            )}
                        </div>
                    )}
                </section>

                <section aria-labelledby="details-heading" className="rounded-lg border border-surface-border bg-card-dark p-6 lg:col-span-3">
                    <h2 id="details-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
                        Your order
                    </h2>
                    <ul className="divide-y divide-surface-border">
                        {order.items.map((line) => (
                            <li key={line.id} className="flex gap-4 py-4">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-surface-border bg-zinc-900">
                                    {line.item.imageUrl && <img src={line.item.imageUrl} alt="" className="h-full w-full object-cover opacity-80" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between gap-4 text-sm">
                                        <p className="font-medium">
                                            {line.quantity}× {line.item.name}
                                        </p>
                                        <p className="tabular-nums">
                                            {formatGel((line.price + line.modifiers.reduce((sum, m) => sum + m.price, 0)) * line.quantity)}
                                        </p>
                                    </div>
                                    {line.modifiers.length > 0 && (
                                        <p className="mt-1 text-xs text-text-muted">{line.modifiers.map((m) => m.modifier.name).join(', ')}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2 flex justify-between border-t border-surface-border pt-4">
                        <p className="font-medium">Total</p>
                        <p className="text-lg font-bold tabular-nums">{formatGel(order.totalPrice)}</p>
                    </div>

                    <dl className="mt-6 space-y-3 border-t border-surface-border pt-6 text-sm">
                        {order.address && (
                            <div className="flex gap-3">
                                <dt>
                                    <MapPin className="h-4 w-4 text-primary-bright" aria-label="Delivery address" />
                                </dt>
                                <dd className="text-gray-300">
                                    {order.address.street}, {order.address.city}
                                </dd>
                            </div>
                        )}
                        {order.contactPhone && (
                            <div className="flex gap-3">
                                <dt>
                                    <Phone className="h-4 w-4 text-primary-bright" aria-label="Contact phone" />
                                </dt>
                                <dd className="text-gray-300 tabular-nums">{order.contactPhone}</dd>
                            </div>
                        )}
                        {order.notes && (
                            <div className="flex gap-3">
                                <dt>
                                    <StickyNote className="h-4 w-4 text-primary-bright" aria-label="Delivery instructions" />
                                </dt>
                                <dd className="text-gray-300">{order.notes}</dd>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <dt className="sr-only">Payment</dt>
                            <dd className="text-gray-400">
                                {order.paymentMethod === 'CASH' ? 'Cash on delivery' : 'Card'} · {order.paymentStatus.toLowerCase()}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>
    );
}
