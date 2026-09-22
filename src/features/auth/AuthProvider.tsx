import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { onSessionExpired, tokenStorage } from '../../lib/http/token-storage';
import { disconnectAllSockets } from '../../lib/realtime/socket';
import { authApi } from './api';
import { AuthContext, type AuthContextValue } from './auth-context';
import { authUserSchema, type AuthSession, type AuthUser } from './types';

function readStoredUser(): AuthUser | null {
    if (!tokenStorage.getAccessToken()) return null;
    const parsed = authUserSchema.safeParse(tokenStorage.getUser());
    if (!parsed.success) {
        tokenStorage.clear();
        return null;
    }
    return parsed.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<AuthUser | null>(readStoredUser);

    const startSession = useCallback(
        (session: AuthSession) => {
            // Drop anything cached for a previous account
            queryClient.clear();
            tokenStorage.setSession(session);
            setUser(session.user);
            return session.user;
        },
        [queryClient],
    );

    const login = useCallback<AuthContextValue['login']>(
        async (body) => startSession(await authApi.login(body)),
        [startSession],
    );

    // The backend returns a token pair on register, so the user is signed in right away
    const register = useCallback<AuthContextValue['register']>(
        async (body) => startSession(await authApi.register(body)),
        [startSession],
    );

    const logout = useCallback(() => {
        tokenStorage.clear();
        disconnectAllSockets();
        setUser(null);
        queryClient.clear();
    }, [queryClient]);

    // Refresh failed in the API client: the session is gone
    useEffect(
        () =>
            onSessionExpired(() => {
                disconnectAllSockets();
                setUser(null);
                queryClient.clear();
                toast.error('Your session expired. Please sign in again.', { id: 'session-expired' });
            }),
        [queryClient],
    );

    const value = useMemo<AuthContextValue>(
        () => ({ user, isAuthenticated: user !== null, login, register, logout }),
        [user, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
