import { api } from '../../lib/http/api-client';
import { parseResponse } from '../../lib/http/parse';
import { menuCategoriesSchema, type MenuCategory } from './types';

export const menuApi = {
    /** Categories sorted by sortOrder, each with its active items and their modifiers. */
    async getCategories(): Promise<MenuCategory[]> {
        const { data } = await api.get<unknown>('/menu/categories');
        return parseResponse(menuCategoriesSchema, data, 'menu');
    },
};
