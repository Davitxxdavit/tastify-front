import { Link } from 'react-router-dom';
import { formatGel } from '../../../lib/format';
import { cartTotals, lineTotal, type CartLine } from '../../cart/cart-logic';
import type { ReconciledCart } from '../reconcile';

interface OrderSummaryProps {
    lines: CartLine[];
    reconciled: ReconciledCart | null;
    onRemove: (key: string) => void;
    onRemoveUnavailable: () => void;
    rootError?: string;
    isSubmitting: boolean;
    canSubmit: boolean;
}

export function OrderSummary({ lines, reconciled, onRemove, onRemoveUnavailable, rootError, isSubmitting, canSubmit }: OrderSummaryProps) {
    // Show current menu prices once the menu has loaded
    const shownLines = reconciled ? [...reconciled.available, ...reconciled.unavailable] : lines;
    const unavailableKeys = new Set(reconciled?.unavailable.map((l) => l.key));
    const { totalPrice } = cartTotals(reconciled ? reconciled.available : lines);

    return (
        <div className="sticky top-24 rounded border border-surface-border bg-card-dark p-6 shadow-2xl">
            <h2 className="text-lg font-medium text-white mb-6 uppercase tracking-wide">Your Order</h2>

            {reconciled && reconciled.unavailable.length > 0 && (
                <div role="alert" className="mb-6 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
                    Some items are no longer on the menu.{' '}
                    <button type="button" onClick={onRemoveUnavailable} className="underline hover:text-white">
                        Remove them
                    </button>{' '}
                    to continue.
                </div>
            )}
            {reconciled?.pricesChanged && (
                <p className="mb-6 rounded border border-surface-border p-3 text-xs text-text-muted">
                    Prices were updated to match the current menu.
                </p>
            )}

            <div className="flow-root mb-8">
                <ul className="-my-6 divide-y divide-surface-border">
                    {shownLines.length === 0 ? (
                        <li className="py-6 text-text-muted text-sm text-center">
                            Your cart is empty.{' '}
                            <Link to="/menu" className="text-primary-bright underline">
                                Go to Menu
                            </Link>
                        </li>
                    ) : (
                        shownLines.map((line) => {
                            const unavailable = unavailableKeys.has(line.key);
                            return (
                                <li key={line.key} className="flex py-6">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-surface-border bg-zinc-900">
                                        {line.imageUrl && (
                                            <img alt="" className="h-full w-full object-cover object-center opacity-80" src={line.imageUrl} />
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div className="flex justify-between gap-3 text-sm font-medium text-white">
                                            <h3 className={unavailable ? 'line-through text-text-muted' : undefined}>{line.name}</h3>
                                            <p className="tabular-nums">{formatGel(lineTotal(line))}</p>
                                        </div>
                                        {line.modifiers.length > 0 && (
                                            <p className="mt-1 text-xs text-text-muted">{line.modifiers.map((m) => m.name).join(', ')}</p>
                                        )}
                                        {unavailable && <p className="mt-1 text-xs text-yellow-300">No longer available</p>}
                                        <div className="flex flex-1 items-end justify-between text-xs">
                                            <p className="text-text-muted">Qty {line.quantity}</p>
                                            <button
                                                type="button"
                                                onClick={() => onRemove(line.key)}
                                                aria-label={`Remove ${line.name}`}
                                                className="font-medium text-text-muted hover:text-white transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>

            <div className="border-t border-surface-border py-6 space-y-4">
                <div className="flex justify-between text-sm text-text-muted">
                    <p>Subtotal</p>
                    <p className="tabular-nums">{formatGel(totalPrice)}</p>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                    <p>Delivery</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-end border-t border-surface-border pt-4">
                    <p className="text-base text-white font-medium">Total</p>
                    <p className="text-xl font-bold text-white tabular-nums">{formatGel(totalPrice)}</p>
                </div>
            </div>

            {rootError && (
                <p role="alert" className="mb-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {rootError}
                </p>
            )}

            <div className="mt-2">
                <button
                    className="w-full flex items-center justify-center rounded border border-transparent bg-primary px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-bright focus:ring-offset-2 focus:ring-offset-black transition-all transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? (
                        <span>Placing order…</span>
                    ) : (
                        <>
                            <span>Place Order</span>
                            <span className="mx-2 opacity-50">•</span>
                            <span className="tabular-nums">{formatGel(totalPrice)}</span>
                        </>
                    )}
                </button>
                <p className="mt-4 text-center text-[10px] text-text-muted uppercase tracking-widest flex items-center justify-center gap-1 opacity-70">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden>
                        payments
                    </span>
                    You pay the courier on delivery
                </p>
            </div>
        </div>
    );
}
