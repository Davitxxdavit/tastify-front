import { useQuery } from '@tanstack/react-query';
import { menuApi } from './api';

export const menuKeys = {
    all: ['menu'] as const,
    categories: () => [...menuKeys.all, 'categories'] as const,
};

export function useMenuCategories() {
    return useQuery({
        queryKey: menuKeys.categories(),
        queryFn: menuApi.getCategories,
        staleTime: 5 * 60_000,
    });
}
