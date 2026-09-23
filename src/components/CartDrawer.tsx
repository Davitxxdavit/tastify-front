import { useEffect, useId, useRef } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/useCart';
import { lineTotal, lineUnitTotal, MAX_QUANTITY } from '../features/cart/cart-logic';
import { useFocusTrap } from '../lib/a11y/useFocusTrap';
import { formatGel } from '../lib/format';
import { Button } from './ui/Button';

export function CartDrawer() {
    const { isOpen, closeCart } = useCart();

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
                        aria-hidden
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                    <CartPanel />
                </>
            )}
        </AnimatePresence>
    );
}

/** The drawer itself; mounted only while open so the focus trap follows its lifetime. */
function CartPanel() {
    const { lines: items, removeLine, updateQuantity, totalItems, totalPrice, closeCart } = useCart();
    const navigate = useNavigate();
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    useFocusTrap(panelRef, true, { onEscape: closeCart });

    // Keep the page behind the drawer from scrolling
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    return (
        <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col outline-none"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary-bright" aria-hidden />
                    <h2 id={titleId} className="text-xl font-semibold">
                        Your Cart
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
                    <X className="h-5 w-5" aria-hidden />
                </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" aria-hidden />
                        <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Add some delicious items to get started!{' '}
                            <Link to="/menu" onClick={closeCart} className="text-primary-bright underline">
                                Browse the menu
                            </Link>
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4" aria-label="Items in your cart">
                        {items.map((item) => (
                            <motion.li
                                key={item.key}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="flex gap-4 p-4 rounded-lg border bg-card"
                            >
                                <img src={item.imageUrl ?? undefined} alt="" className="w-20 h-20 object-cover rounded-md bg-surface-dark" />
                                <div className="flex-1">
                                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                    {item.modifiers.length > 0 && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{item.modifiers.map((m) => m.name).join(', ')}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">{formatGel(lineUnitTotal(item))}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 mt-2" role="group" aria-label={`Quantity of ${item.name}`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                            aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Decrease ${item.name}`}
                                        >
                                            <Minus className="h-3 w-3" aria-hidden />
                                        </Button>
                                        <span className="w-8 text-center font-medium tabular-nums" aria-live="polite">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                            disabled={item.quantity >= MAX_QUANTITY}
                                            aria-label={`Increase ${item.name}`}
                                        >
                                            <Plus className="h-3 w-3" aria-hidden />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 ml-auto text-red-400"
                                            onClick={() => removeLine(item.key)}
                                            aria-label={`Remove ${item.name} from cart`}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold tabular-nums">{formatGel(lineTotal(item))}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="border-t p-6 space-y-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary-bright tabular-nums">{formatGel(totalPrice)}</span>
                    </div>
                    <Button className="w-full text-white" size="lg" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                </div>
            )}
        </motion.div>
    );
}
