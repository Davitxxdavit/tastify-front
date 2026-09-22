import { z } from 'zod';
import type { CreateOrderRequest } from '../orders/types';

export const MAX_QUANTITY = 99;

export const cartModifierSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    price: z.number(),
});

export const cartLineSchema = z.object({
    /** Item id plus the sorted modifier ids, so each combination is its own line. */
    key: z.string(),
    itemId: z.number().int(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    unitPrice: z.number(),
    modifiers: z.array(cartModifierSchema),
    quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export type CartModifier = z.infer<typeof cartModifierSchema>;
export type CartLine = z.infer<typeof cartLineSchema>;
export type NewCartLine = Omit<CartLine, 'key' | 'quantity'>;

export function lineKey(itemId: number, modifiers: CartModifier[]) {
    const modifierIds = modifiers.map((m) => m.id).sort((a, b) => a - b);
    return modifierIds.length ? `${itemId}:${modifierIds.join(',')}` : `${itemId}`;
}

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;

/** Price of one unit including its modifiers. */
export function lineUnitTotal(line: Pick<CartLine, 'unitPrice' | 'modifiers'>) {
    return roundMoney(line.unitPrice + line.modifiers.reduce((sum, m) => sum + m.price, 0));
}

export function lineTotal(line: CartLine) {
    return roundMoney(lineUnitTotal(line) * line.quantity);
}

const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));

export function addLine(lines: CartLine[], newLine: NewCartLine, quantity = 1): CartLine[] {
    const key = lineKey(newLine.itemId, newLine.modifiers);
    const existing = lines.find((line) => line.key === key);
    if (existing) {
        return lines.map((line) =>
            line.key === key ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line,
        );
    }
    const sortedModifiers = [...newLine.modifiers].sort((a, b) => a.id - b.id);
    return [...lines, { ...newLine, modifiers: sortedModifiers, key, quantity: clampQuantity(quantity) }];
}

export function updateLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
    const next = clampQuantity(quantity);
    if (next === 0) return removeLine(lines, key);
    return lines.map((line) => (line.key === key ? { ...line, quantity: next } : line));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
    return lines.filter((line) => line.key !== key);
}

export function cartTotals(lines: CartLine[]) {
    return {
        totalItems: lines.reduce((sum, line) => sum + line.quantity, 0),
        totalPrice: roundMoney(lines.reduce((sum, line) => sum + lineTotal(line), 0)),
    };
}

/** Maps cart lines to the `items` array of CreateOrderDto. */
export function toOrderItems(lines: CartLine[]): CreateOrderRequest['items'] {
    return lines.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        price: line.unitPrice,
        ...(line.modifiers.length > 0 && {
            modifiers: line.modifiers.map((m) => ({ modifierId: m.id, price: m.price })),
        }),
    }));
}

/** Reads a persisted cart, dropping it if the stored shape is outdated or corrupt. */
export function parseStoredCart(raw: string | null): CartLine[] {
    if (!raw) return [];
    try {
        const parsed = z.array(cartLineSchema).safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : [];
    } catch {
        return [];
    }
}
