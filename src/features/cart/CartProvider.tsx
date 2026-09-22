import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CartContext, type CartContextValue } from './cart-context';
import * as cart from './cart-logic';

// v2: lines keyed by item + modifiers; the old v1 `cart` key used string product ids
const STORAGE_KEY = 'cart:v2';

function loadCart() {
    try {
        return cart.parseStoredCart(localStorage.getItem(STORAGE_KEY));
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [lines, setLines] = useState<cart.CartLine[]>(loadCart);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
        } catch {
            // Storage full or blocked: the cart still works for this session
        }
    }, [lines]);

    const addLine = useCallback<CartContextValue['addLine']>(
        (line, quantity) => setLines((prev) => cart.addLine(prev, line, quantity)),
        [],
    );
    const updateQuantity = useCallback<CartContextValue['updateQuantity']>(
        (key, quantity) => setLines((prev) => cart.updateLineQuantity(prev, key, quantity)),
        [],
    );
    const removeLine = useCallback((key: string) => setLines((prev) => cart.removeLine(prev, key)), []);
    const clearCart = useCallback(() => setLines([]), []);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const value = useMemo<CartContextValue>(
        () => ({
            lines,
            ...cart.cartTotals(lines),
            addLine,
            updateQuantity,
            removeLine,
            clearCart,
            isOpen,
            openCart,
            closeCart,
        }),
        [lines, addLine, updateQuantity, removeLine, clearCart, isOpen, openCart, closeCart],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
