import type { CartLine } from '../cart/cart-logic';
import type { MenuCategory } from '../menu/types';

export interface ReconciledCart {
    /** Lines still on the menu, with current item and modifier prices. */
    available: CartLine[];
    /** Lines whose item or one of its modifiers is no longer offered. */
    unavailable: CartLine[];
    /** True when any price differs from what the cart remembered. */
    pricesChanged: boolean;
}

/**
 * A persisted cart can outlive menu changes. Before ordering, re-read prices
 * from the current menu and flag anything that's been removed.
 */
export function reconcileCart(lines: CartLine[], categories: MenuCategory[]): ReconciledCart {
    const items = new Map(categories.flatMap((c) => c.items).map((item) => [item.id, item]));
    const result: ReconciledCart = { available: [], unavailable: [], pricesChanged: false };

    for (const line of lines) {
        const item = items.get(line.itemId);
        const modifiers = line.modifiers.map((m) => item?.modifiers.find((current) => current.id === m.id));

        if (!item || modifiers.some((m) => m === undefined)) {
            result.unavailable.push(line);
            continue;
        }

        const fresh: CartLine = {
            ...line,
            unitPrice: item.price,
            modifiers: modifiers.map((m) => ({ id: m!.id, name: m!.name, price: m!.price })),
        };
        if (fresh.unitPrice !== line.unitPrice || fresh.modifiers.some((m, i) => m.price !== line.modifiers[i].price)) {
            result.pricesChanged = true;
        }
        result.available.push(fresh);
    }

    return result;
}
