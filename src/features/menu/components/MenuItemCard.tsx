import { toast } from 'react-hot-toast';
import { formatGel } from '../../../lib/format';
import { useCart } from '../../cart/useCart';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
    item: MenuItem;
    onCustomize: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onCustomize }: MenuItemCardProps) {
    const { addLine } = useCart();
    const hasOptions = item.modifiers.length > 0;

    const handleAdd = () => {
        if (hasOptions) {
            onCustomize(item);
            return;
        }
        addLine({ itemId: item.id, name: item.name, imageUrl: item.imageUrl, unitPrice: item.price, modifiers: [] });
        toast.success(`${item.name} added to your order`);
    };

    return (
        <article className="@container group" aria-labelledby={`menu-item-${item.id}`}>
            <div className="flex flex-col sm:flex-row h-full items-stretch justify-start rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <div
                    className="w-full sm:w-48 bg-center bg-no-repeat bg-cover min-h-[200px] sm:min-h-full bg-gradient-to-br from-primary/40 to-[#0a0a0a]"
                    style={item.imageUrl ? { backgroundImage: `url('${item.imageUrl}')` } : undefined}
                    role="img"
                    aria-label={item.name}
                ></div>
                <div className="flex w-full grow flex-col justify-between p-5 gap-4">
                    <div>
                        <div className="flex justify-between items-start mb-2 gap-3">
                            <h3 id={`menu-item-${item.id}`} className="text-white font-serif text-xl font-bold leading-tight">
                                {item.name}
                            </h3>
                            <span className="text-primary-bright font-bold whitespace-nowrap tabular-nums">
                                {formatGel(item.price)}
                            </span>
                        </div>
                        {item.description && (
                            <p className="text-gray-400 text-sm font-normal leading-relaxed line-clamp-3">{item.description}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <span className="text-xs text-gray-500">
                            {hasOptions && `${item.modifiers.length} extra${item.modifiers.length > 1 ? 's' : ''} available`}
                        </span>
                        <button
                            type="button"
                            onClick={handleAdd}
                            aria-label={`${hasOptions ? 'Choose options for' : 'Add'} ${item.name}`}
                            className="flex items-center gap-2 px-4 py-2 rounded border border-primary/30 bg-primary/10 hover:bg-primary hover:border-primary text-primary-bright hover:text-white text-xs uppercase tracking-wider font-bold transition-all duration-300 group/btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright"
                        >
                            <span className="truncate">{hasOptions ? 'Choose options' : 'Add to Cart'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
