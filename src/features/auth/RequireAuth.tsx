import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/** Sends signed-out visitors to /login and brings them back afterwards. */
export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        const redirect = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
    }
    return <>{children}</>;
}
