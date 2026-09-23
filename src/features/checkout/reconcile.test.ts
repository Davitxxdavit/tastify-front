import { describe, expect, it } from 'vitest';
import { menuCategoriesSchema } from '../menu/types';
import { menuCategories } from '../../test/fixtures';
import { addLine } from '../cart/cart-logic';
import { reconcileCart } from './reconcile';

const menu = menuCategoriesSchema.parse(menuCategories);

describe('reconcileCart', () => {
    it('keeps available lines and refreshes stale prices', () => {
        const lines = addLine([], { itemId: 8, name: 'Adjarian Khachapuri', imageUrl: null, unitPrice: 15, modifiers: [{ id: 11, name: 'Extra egg', price: 1 }] });
        const result = reconcileCart(lines, menu);
        expect(result.unavailable).toEqual([]);
        expect(result.pricesChanged).toBe(true);
        expect(result.available[0]).toMatchObject({ unitPrice: 18, modifiers: [{ id: 11, price: 1.5 }] });
    });

    it('flags items and modifiers that are no longer on the menu', () => {
        let lines = addLine([], { itemId: 999, name: 'Old dish', imageUrl: null, unitPrice: 5, modifiers: [] });
        lines = addLine(lines, { itemId: 8, name: 'Adjarian Khachapuri', imageUrl: null, unitPrice: 18, modifiers: [{ id: 2, name: 'Gone', price: 1 }] });
        lines = addLine(lines, { itemId: 9, name: 'Imeruli Khachapuri', imageUrl: null, unitPrice: 16, modifiers: [] });
        const result = reconcileCart(lines, menu);
        expect(result.unavailable.map((l) => l.key)).toEqual(['999', '8:2']);
        expect(result.available.map((l) => l.key)).toEqual(['9']);
        expect(result.pricesChanged).toBe(false);
    });
});
