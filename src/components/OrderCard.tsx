import { motion } from 'framer-motion';
import type { Order } from '../services/orders.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Calendar, Package } from 'lucide-react';

interface OrderCardProps {
    order: Order;
}

const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PREPARING: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    READY: 'bg-green-500/10 text-green-500 border-green-500/20',
    DELIVERED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function OrderCard({ order }: OrderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge className={statusColors[order.status]}>
                            {order.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    <Package className="h-3 w-3 inline mr-1" />
                                    {item.quantity}x Item
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    {order.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            <strong>Notes:</strong> {order.notes}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
