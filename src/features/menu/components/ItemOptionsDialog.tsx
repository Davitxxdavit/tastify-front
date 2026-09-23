import { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFocusTrap } from '../../../lib/a11y/useFocusTrap';
import { formatGel } from '../../../lib/format';
import { useCart } from '../../cart/useCart';
import { lineUnitTotal, MAX_QUANTITY } from '../../cart/cart-logic';
import type { MenuItem } from '../types';

interface ItemOptionsDialogProps {
    item: MenuItem;
    onClose: () => void;
}

/** Lets the customer pick modifiers and a quantity before adding an item. */
export function ItemOptionsDialog({ item, onClose }: ItemOptionsDialogProps) {
    const { addLine } = useCart();
    const [selected, setSelected] = useState<number[]>([]);
    const [quantity, setQuantity] = useState(1);
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    useFocusTrap(dialogRef, true, { onEscape: onClose });

    const modifiers = item.modifiers.filter((m) => selected.includes(m.id));
    const unitTotal = lineUnitTotal({ unitPrice: item.price, modifiers });

    const toggle = (id: number) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const handleAdd = () => {
        addLine(
            {
                itemId: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                unitPrice: item.price,
                modifiers: modifiers.map(({ id, name, price }) => ({ id, name, price })),
            },
            quantity,
        );
        toast.success(`${quantity}× ${item.name} added to your order`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                aria-hidden
            />
            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] text-white shadow-2xl"
            >
                {item.imageUrl && (
                    <div
                        className="h-44 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.imageUrl}')` }}
                        aria-hidden
                    />
                )}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright"
                >
                    <X className="h-4 w-4" aria-hidden />
                </button>

                <div className="space-y-5 p-6">
                    <div>
                        <h2 id={titleId} className="font-serif text-2xl font-bold">
                            {item.name}
                        </h2>
                        {item.description && <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.description}</p>}
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Extras</legend>
                        {item.modifiers.map((modifier) => (
                            <label
                                key={modifier.id}
                                className="flex cursor-pointer items-center gap-3 rounded border border-[#1a1a1a] px-4 py-3 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-bright"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(modifier.id)}
                                    onChange={() => toggle(modifier.id)}
                                    className="h-4 w-4 accent-[#11d473]"
                                />
                                <span className="flex-1 text-sm">{modifier.name}</span>
                                <span className="text-sm tabular-nums text-gray-400">
                                    {modifier.price > 0 ? `+${formatGel(modifier.price)}` : 'Free'}
                                </span>
                            </label>
                        ))}
                    </fieldset>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3" role="group" aria-label="Quantity">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="rounded border border-[#1a1a1a] p-2 hover:border-primary/50 disabled:opacity-40"
                            >
                                <Minus className="h-4 w-4" aria-hidden />
                            </button>
                            <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                                disabled={quantity >= MAX_QUANTITY}
                                aria-label="Increase quantity"
                                className="rounded border border-[#1a1a1a] p-2 hover:border-primary/50 disabled:opacity-40"
                            >
                                <Plus className="h-4 w-4" aria-hidden />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="flex-1 rounded bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-hover"
                        >
                            Add · {formatGel(unitTotal * quantity)}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
