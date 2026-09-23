import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './http/api-error';

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                // Don't retry client errors (4xx) or contract mismatches; retry network/5xx twice
                retry: (failureCount, error) => {
                    if (error instanceof ApiError && (error.status === -1 || (error.status >= 400 && error.status < 500))) {
                        return false;
                    }
                    return failureCount < 2;
                },
            },
            mutations: {
                retry: false,
            },
        },
    });
}
