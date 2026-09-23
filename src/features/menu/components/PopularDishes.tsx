import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatGel } from '../../../lib/format';
import { useCart } from '../../cart/useCart';
import { useMenuCategories } from '../hooks';
import type { MenuItem } from '../types';
import { ItemOptionsDialog } from './ItemOptionsDialog';

// Signature dishes to feature when they're on the menu
const FEATURED = ['Kalakuri Khinkali (5pcs)', 'Adjarian Khachapuri', 'Assorted Pkhali', 'Pork Mtsvadi'];

/** "Popular This Week" cards, fed by the live menu. */
export function PopularDishes() {
    const { data: categories, isPending, isError } = useMenuCategories();
    const { addLine } = useCart();
    const [customizing, setCustomizing] = useState<MenuItem | null>(null);

    const dishes = useMemo(() => {
        const items = categories?.flatMap((c) => c.items) ?? [];
        const featured = FEATURED.map((name) => items.find((item) => item.name === name)).filter((item): item is MenuItem => !!item);
        return (featured.length > 0 ? featured : items).slice(0, 4);
    }, [categories]);

    const handleAdd = (item: MenuItem) => {
        if (item.modifiers.length > 0) {
            setCustomizing(item);
            return;
        }
        addLine({ itemId: item.id, name: item.name, imageUrl: item.imageUrl, unitPrice: item.price, modifiers: [] });
        toast.success(`${item.name} added to your order`);
    };

    if (isError) {
        return (
            <p className="text-center text-gray-400">
                Our dishes are taking a moment to load. <Link to="/menu" className="text-primary-bright underline">Open the menu</Link>
            </p>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isPending
                    ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-96 rounded-2xl" />)
                    : dishes.map((item) => (
                          <div key={item.id} className="bg-surface-dark rounded-2xl p-4 group hover:-translate-y-1 transition-transform duration-300 border border-surface-border hover:border-primary/40">
                              <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                                  <div
                                      className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-primary/40 to-surface-dark"
                                      style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")` } : undefined}
                                      role="img"
                                      aria-label={item.name}
                                  ></div>
                                  <button
                                      type="button"
                                      onClick={() => handleAdd(item)}
                                      aria-label={item.modifiers.length > 0 ? `Choose options for ${item.name}` : `Add ${item.name} to your order`}
                                      className="absolute bottom-3 right-3 size-10 bg-white text-surface-dark rounded-full flex items-center justify-center translate-y-14 group-hover:translate-y-0 focus-visible:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright"
                                  >
                                      <span className="material-symbols-outlined" aria-hidden>
                                          add
                                      </span>
                                  </button>
                              </div>
                              <div className="flex justify-between items-start gap-3 mb-2">
                                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                  <span className="text-primary-bright font-bold whitespace-nowrap tabular-nums">{formatGel(item.price)}</span>
                              </div>
                              {item.description && <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.description}</p>}
                          </div>
                      ))}
            </div>
            <AnimatePresence>
                {customizing && <ItemOptionsDialog key={customizing.id} item={customizing} onClose={() => setCustomizing(null)} />}
            </AnimatePresence>
        </>
    );
}
