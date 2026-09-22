import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";
import { useCart } from "../features/cart/useCart";
import { useMenuCategories } from "../features/menu/hooks";
import { useMenuFilters } from "../features/menu/useMenuFilters";
import { categorySlug, filterMenu } from "../features/menu/filter";
import { MenuItemCard } from "../features/menu/components/MenuItemCard";
import { MenuSkeleton } from "../features/menu/components/MenuSkeleton";
import { ItemOptionsDialog } from "../features/menu/components/ItemOptionsDialog";
import type { MenuItem } from "../features/menu/types";
import { ErrorState } from "../components/ui/ErrorState";
import { formatGel } from "../lib/format";

const HERO_BACKGROUND = "linear-gradient(to bottom, rgba(5, 5, 5, 0.5), rgba(5, 5, 5, 1)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoF3I5haA2AYsuKmqDUn-FhgsSESKQpFE1JIGj0T9VheNGkeiaLY5_NXoGD5TtzINoUOaMAQ37XAUN99Ptuef9U3aplyT2nrXfwHOx0t1NEgkuytZj0N2lYqt3IyKTNg1Lp0mOpbVP7BLqhv58Mj1ZkDnbPbNgxvBu271t9orE3i-0IJ8xF7kvR57LJnXQ6fSrN4DCxIBK27H2Ts1i797v_-ItIMSVGeLAcqdHDoWng6GXJKppL6wxROgDU57YZ6RxpLoIzz5kKt-4')";

// Section taglines for the seeded categories; other categories just show their name
const CATEGORY_TAGLINES: Record<string, string> = {
    appetizers: "Start your journey",
    mains: "Hearty Traditions",
    "pastry-dough": "Fresh from the oven",
    desserts: "Sweet endings",
};

export default function Menu() {
    const { totalItems, totalPrice, openCart } = useCart();
    const { data: categories, isPending, isError, error, refetch, isRefetching } = useMenuCategories();
    const { filters, setQuery, setCategory, clearFilters } = useMenuFilters();
    const [customizing, setCustomizing] = useState<MenuItem | null>(null);

    const { query, category } = filters;
    const visibleCategories = useMemo(
        () => (categories ? filterMenu(categories, { query, category }) : []),
        [categories, query, category]
    );
    const matchCount = visibleCategories.reduce((sum, c) => sum + c.items.length, 0);
    const isFiltered = query !== "" || category !== null;

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
            {/* Hero Section */}
            <div
                className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: HERO_BACKGROUND }}
            >
                <div className="text-center z-10 px-4 max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary-bright text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                        Authentic Georgian Cuisine
                    </span>
                    <h1 className="text-white font-serif text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-xl">
                        Taste of Batumi
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light opacity-90 max-w-lg mx-auto leading-relaxed">
                        Experience the rich heritage of Georgian flavors, crafted with
                        passion and premium ingredients.
                    </p>
                </div>
            </div>

            {/* Sticky toolbar: categories + search */}
            <div className="sticky top-16 z-40 bg-background-dark/95 backdrop-blur-xl border-b border-primary/20 shadow-sm">
                <div className="layout-content-container flex flex-col md:flex-row md:items-center gap-3 md:gap-8 max-w-[1280px] mx-auto px-4 md:px-10 lg:px-20 py-3 md:py-0">
                    <nav aria-label="Menu categories" className="flex overflow-x-auto no-scrollbar gap-6 md:gap-10 flex-1 order-2 md:order-1">
                        {[{ slug: null, name: "All" }, ...(categories ?? []).map((c) => ({ slug: categorySlug(c.name), name: c.name }))].map((cat) => {
                            const active = filters.category === cat.slug;
                            return (
                                <button
                                    key={cat.slug ?? "all"}
                                    type="button"
                                    onClick={() => setCategory(cat.slug)}
                                    aria-pressed={active}
                                    className={clsx(
                                        "flex flex-col items-center justify-center border-b-2 pb-3 pt-2 md:pt-4 min-w-fit px-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright",
                                        active ? "border-primary-bright" : "border-transparent hover:border-primary/50"
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            "text-sm md:text-base font-bold leading-normal tracking-wide uppercase",
                                            active ? "text-primary-bright" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                    <div className="relative order-1 md:order-2 md:w-72">
                        <label htmlFor="menu-search" className="sr-only">
                            Search dishes
                        </label>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden />
                        <input
                            id="menu-search"
                            type="search"
                            value={filters.query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search khachapuri, khinkali…"
                            className="h-10 w-full rounded border border-[#1a1a1a] bg-black pl-9 pr-9 text-sm text-white placeholder:text-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {filters.query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-white"
                            >
                                <X className="h-4 w-4" aria-hidden />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full bg-background-dark">
                <div className="layout-content-container max-w-[1280px] mx-auto px-4 md:px-10 lg:px-20 py-10 flex flex-col gap-16">
                    {isPending ? (
                        <MenuSkeleton />
                    ) : isError ? (
                        <ErrorState title="We couldn't load the menu" error={error} onRetry={() => refetch()} isRetrying={isRefetching} />
                    ) : categories.length === 0 ? (
                        <div className="py-16 text-center">
                            <h2 className="font-serif text-2xl font-bold">The menu is being prepared</h2>
                            <p className="mt-2 text-gray-400">No dishes are available right now. Please check back soon.</p>
                        </div>
                    ) : matchCount === 0 ? (
                        <div className="py-16 text-center">
                            <h2 className="font-serif text-2xl font-bold">No dishes found</h2>
                            <p className="mt-2 text-gray-400">
                                {filters.query ? <>Nothing matches “{filters.query}”.</> : "This category is empty."}
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-6 rounded border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-bright hover:bg-primary hover:text-white"
                            >
                                Show the full menu
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="sr-only" role="status">
                                {isFiltered ? `${matchCount} dish${matchCount === 1 ? "" : "es"} found` : ""}
                            </p>
                            {visibleCategories.map((cat) => (
                                <section key={cat.id} aria-labelledby={`category-${cat.id}`} className="scroll-mt-32">
                                    <div className="flex items-end justify-between mb-8 border-b border-primary/20 pb-4">
                                        <div>
                                            <h2 id={`category-${cat.id}`} className="text-white font-serif text-3xl font-bold tracking-tight mb-1">
                                                {cat.name}
                                            </h2>
                                            {CATEGORY_TAGLINES[categorySlug(cat.name)] && (
                                                <p className="text-gray-400 text-sm font-medium">{CATEGORY_TAGLINES[categorySlug(cat.name)]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {cat.items.map((item) => (
                                            <MenuItemCard key={item.id} item={item} onCustomize={setCustomizing} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </>
                    )}
                </div>
                <div className="h-24"></div>
            </main>

            <AnimatePresence>
                {customizing && <ItemOptionsDialog key={customizing.id} item={customizing} onClose={() => setCustomizing(null)} />}
            </AnimatePresence>

            {/* Floating Cart Button (kept clear of the chat bubble in the bottom-right corner) */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 left-4 sm:left-1/2 sm:-translate-x-1/2 z-40">
                    <button
                        type="button"
                        onClick={openCart}
                        aria-label={`View order: ${totalItems} ${totalItems === 1 ? "item" : "items"}, ${formatGel(totalPrice)}`}
                        className="flex items-center gap-3 sm:gap-4 whitespace-nowrap bg-primary hover:bg-primary-hover text-background-dark rounded-full px-5 py-3 sm:px-6 sm:py-4 shadow-[0_4px_20px_rgba(17,212,115,0.3)] transition-all hover:scale-105 active:scale-95 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-bright"
                    >
                        <div className="flex flex-col items-start text-white">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                Total ({totalItems} {totalItems === 1 ? "item" : "items"})
                            </span>
                            <span className="text-lg font-black tabular-nums">{formatGel(totalPrice)}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/20"></div>
                        <div className="flex items-center gap-2 font-bold text-white">
                            <span className="hidden sm:inline">View Order</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden>
                                arrow_forward
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
