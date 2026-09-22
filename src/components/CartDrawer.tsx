import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../features/cart/useCart';
import { lineTotal, lineUnitTotal } from '../features/cart/cart-logic';
import { formatGel } from '../lib/format';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
    const { lines: items, removeLine, updateQuantity, totalItems, totalPrice, isOpen, closeCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">Your Cart</h2>
                                <span className="text-sm text-muted-foreground">({totalItems} items)</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeCart}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                    <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                                    <p className="text-sm text-muted-foreground mt-2">Add some delicious items to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.key}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="flex gap-4 p-4 rounded-lg border bg-card"
                                        >
                                            <img
                                                src={item.imageUrl ?? undefined}
                                                alt=""
                                                className="w-20 h-20 object-cover rounded-md bg-surface-dark"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                                {item.modifiers.length > 0 && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {item.modifiers.map((m) => m.name).join(', ')}
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">{formatGel(lineUnitTotal(item))}</p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 ml-auto text-destructive"
                                                        onClick={() => removeLine(item.key)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatGel(lineTotal(item))}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t p-6 space-y-4">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatGel(totalPrice)}</span>
                                </div>
                                <Button className="w-full" size="lg" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
