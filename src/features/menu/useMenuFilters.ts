import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MenuFilters } from './filter';

/** Search and category filters stored in the URL (?q=...&category=...), so they survive reloads and can be shared. */
export function useMenuFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: MenuFilters = {
        query: searchParams.get('q') ?? '',
        category: searchParams.get('category'),
    };

    const update = useCallback(
        (key: 'q' | 'category', value: string | null) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (value) next.set(key, value);
                    else next.delete(key);
                    return next;
                },
                // Typing shouldn't flood the history; switching categories should be undoable with Back
                { replace: key === 'q' },
            );
        },
        [setSearchParams],
    );

    const setQuery = useCallback((query: string) => update('q', query), [update]);
    const setCategory = useCallback((category: string | null) => update('category', category), [update]);
    const clearFilters = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

    return { filters, setQuery, setCategory, clearFilters };
}
