import { useEffect, useState } from 'react';
import { ordersService, type Order } from '../services/orders.service';
import { OrderCard } from '../components/OrderCard';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await ordersService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Could not load orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground">Start ordering some delicious burgers!</p>
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
