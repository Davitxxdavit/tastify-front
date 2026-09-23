import { describe, expect, it } from 'vitest';
import {
    addLine,
    cartTotals,
    lineKey,
    lineTotal,
    MAX_QUANTITY,
    parseStoredCart,
    removeLine,
    toOrderItems,
    updateLineQuantity,
    type NewCartLine,
} from './cart-logic';

const khachapuri: NewCartLine = { itemId: 8, name: 'Adjarian Khachapuri', imageUrl: null, unitPrice: 18, modifiers: [] };
const egg = { id: 11, name: 'Extra egg', price: 1.5 };
const butter = { id: 12, name: 'Extra butter', price: 1 };

describe('cart logic', () => {
    it('merges the same item and modifiers into one line', () => {
        let lines = addLine([], khachapuri);
        lines = addLine(lines, khachapuri, 2);
        expect(lines).toHaveLength(1);
        expect(lines[0].quantity).toBe(3);
    });

    it('keeps different modifier combinations as separate lines, regardless of selection order', () => {
        let lines = addLine([], { ...khachapuri, modifiers: [egg, butter] });
        lines = addLine(lines, { ...khachapuri, modifiers: [butter, egg] });
        lines = addLine(lines, { ...khachapuri, modifiers: [egg] });
        expect(lines.map((l) => [l.key, l.quantity])).toEqual([
            ['8:11,12', 2],
            ['8:11', 1],
        ]);
        expect(lineKey(8, [])).toBe('8');
    });

    it('prices a line including modifiers', () => {
        const [line] = addLine([], { ...khachapuri, modifiers: [egg] }, 2);
        expect(lineTotal(line)).toBe(39);
    });

    it('sums totals without floating point drift', () => {
        let lines = addLine([], { itemId: 1, name: 'a', imageUrl: null, unitPrice: 0.1, modifiers: [] });
        lines = addLine(lines, { itemId: 2, name: 'b', imageUrl: null, unitPrice: 0.2, modifiers: [] });
        expect(cartTotals(lines)).toEqual({ totalItems: 2, totalPrice: 0.3 });
    });

    it('removes a line when its quantity drops to zero and clamps large quantities', () => {
        const lines = addLine([], khachapuri);
        expect(updateLineQuantity(lines, '8', 0)).toEqual([]);
        expect(updateLineQuantity(lines, '8', 500)[0].quantity).toBe(MAX_QUANTITY);
        expect(removeLine(lines, '8')).toEqual([]);
    });

    it('maps lines to the CreateOrderDto items shape', () => {
        let lines = addLine([], { ...khachapuri, modifiers: [egg] }, 2);
        lines = addLine(lines, { itemId: 1, name: 'Badrijani', imageUrl: null, unitPrice: 12, modifiers: [] });
        expect(toOrderItems(lines)).toEqual([
            { itemId: 8, quantity: 2, price: 18, modifiers: [{ modifierId: 11, price: 1.5 }] },
            { itemId: 1, quantity: 1, price: 12 },
        ]);
    });

    it('ignores a corrupt or outdated persisted cart', () => {
        expect(parseStoredCart('not json')).toEqual([]);
        // v1 format: string ids, no key or modifiers
        expect(parseStoredCart(JSON.stringify([{ id: '101', name: 'x', price: 1, quantity: 1 }]))).toEqual([]);
        const valid = addLine([], khachapuri);
        expect(parseStoredCart(JSON.stringify(valid))).toEqual(valid);
    });
});
