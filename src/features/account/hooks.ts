import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { accountApi } from './api';

export const accountKeys = {
    all: ['account'] as const,
    profile: () => [...accountKeys.all, 'profile'] as const,
    addresses: () => [...accountKeys.all, 'addresses'] as const,
};

export function useProfile() {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: accountKeys.profile(),
        queryFn: accountApi.getProfile,
        enabled: isAuthenticated,
    });
}

export function useAddresses() {
    const { isAuthenticated } = useAuth();
    return useQuery({
        queryKey: accountKeys.addresses(),
        queryFn: accountApi.getAddresses,
        enabled: isAuthenticated,
    });
}

export function useCreateAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountApi.createAddress,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
    });
}
