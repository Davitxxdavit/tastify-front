import type { MenuCategory } from './types';

/** URL-friendly category id, e.g. "Pastry & Dough" -> "pastry-dough". */
export function categorySlug(name: string) {
    return name
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '');
}

const normalize = (text: string) =>
    text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '');

export interface MenuFilters {
    /** Free-text search over item name and description. */
    query: string;
    /** Category slug, or null for all categories. */
    category: string | null;
}

/**
 * Applies search and category filters. Categories without matching items are
 * dropped, so the result can be rendered section by section.
 */
export function filterMenu(categories: MenuCategory[], { query, category }: MenuFilters): MenuCategory[] {
    const terms = normalize(query).split(/\s+/).filter(Boolean);

    return categories
        .filter((c) => category === null || categorySlug(c.name) === category)
        .map((c) => ({
            ...c,
            items: c.items.filter((item) => {
                if (terms.length === 0) return true;
                const haystack = normalize(`${item.name} ${item.description ?? ''}`);
                return terms.every((term) => haystack.includes(term));
            }),
        }))
        .filter((c) => c.items.length > 0);
}
