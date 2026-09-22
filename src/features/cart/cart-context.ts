import { createContext } from 'react';
import type { CartLine, NewCartLine } from './cart-logic';

export interface CartContextValue {
    lines: CartLine[];
    totalItems: number;
    totalPrice: number;
    addLine: (line: NewCartLine, quantity?: number) => void;
    updateQuantity: (key: string, quantity: number) => void;
    removeLine: (key: string) => void;
    clearCart: () => void;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
