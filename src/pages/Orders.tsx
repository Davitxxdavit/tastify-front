import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useOrders } from '../features/orders/hooks';
import { OrderCard } from '../components/OrderCard';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';

export default function Orders() {
    const { data: orders, isPending, isError, error, refetch, isRefetching } = useOrders();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground">Track your order history and status</p>
            </motion.div>

            {isPending ? (
                <div className="space-y-4" aria-busy="true" aria-label="Loading orders">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                </div>
            ) : isError ? (
                <ErrorState title="Couldn't load your orders" error={error} onRetry={() => refetch()} isRetrying={isRefetching} />
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" aria-hidden />
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground">
                        Hungry? <Link to="/menu" className="text-primary-bright underline">Browse the menu</Link>
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
