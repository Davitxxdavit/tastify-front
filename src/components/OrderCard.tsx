import { motion } from 'framer-motion';
import type { Order } from '../features/orders/types';
import { ORDER_STATUS_META } from '../features/orders/status';
import { formatDateTime, formatGel } from '../lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Calendar, Package } from 'lucide-react';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const status = ORDER_STATUS_META[order.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" aria-hidden />
                                {formatDateTime(order.createdAt)}
                                {order.scheduledFor && <> · scheduled for {formatDateTime(order.scheduledFor)}</>}
                            </CardDescription>
                        </div>
                        <Badge className={status.badgeClass}>{status.label}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ul className="space-y-1">
                        {order.items.map((line) => (
                            <li key={line.id} className="text-sm text-muted-foreground">
                                <Package className="h-3 w-3 inline mr-1" aria-hidden />
                                {line.quantity}× {line.item.name}
                                {line.modifiers.length > 0 && (
                                    <span className="text-xs"> ({line.modifiers.map((m) => m.modifier.name).join(', ')})</span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-surface-border pt-3 text-sm">
                        <span className="text-muted-foreground">
                            {order.paymentMethod === 'CASH' ? 'Cash on delivery' : 'Card'}
                        </span>
                        <span className="font-semibold text-white tabular-nums">{formatGel(order.totalPrice)}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
