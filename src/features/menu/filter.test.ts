import { describe, expect, it } from 'vitest';
import { menuCategoriesSchema } from './types';
import { categorySlug, filterMenu } from './filter';
import { menuCategories } from '../../test/fixtures';

const categories = menuCategoriesSchema.parse(menuCategories);
const names = (result: ReturnType<typeof filterMenu>) => result.flatMap((c) => c.items.map((i) => i.name));

describe('menu filtering', () => {
    it('makes URL-friendly category slugs', () => {
        expect(categorySlug('Pastry & Dough')).toBe('pastry-dough');
        expect(categorySlug('  Appetizers ')).toBe('appetizers');
        expect(categorySlug('ცხელი კერძები')).toBe('ცხელი-კერძები');
    });

    it('returns everything without filters', () => {
        expect(names(filterMenu(categories, { query: '', category: null }))).toHaveLength(5);
    });

    it('searches names and descriptions, case- and accent-insensitive', () => {
        expect(names(filterMenu(categories, { query: 'KHACHAPURI', category: null }))).toEqual(['Adjarian Khachapuri', 'Imeruli Khachapuri']);
        expect(names(filterMenu(categories, { query: 'pate', category: null }))).toEqual(['Assorted Pkhali']);
        expect(names(filterMenu(categories, { query: 'cheese bread', category: null }))).toEqual(['Imeruli Khachapuri']);
    });

    it('filters by category slug and drops empty categories', () => {
        const result = filterMenu(categories, { query: '', category: 'appetizers' });
        expect(result.map((c) => c.name)).toEqual(['Appetizers']);
        expect(filterMenu(categories, { query: 'lobiani', category: 'appetizers' })).toEqual([]);
    });

    it('combines search and category', () => {
        expect(names(filterMenu(categories, { query: 'bread', category: 'pastry-dough' }))).toEqual(['Adjarian Khachapuri', 'Imeruli Khachapuri', 'Lobiani']);
    });
});
