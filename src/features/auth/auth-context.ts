import { createContext } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest } from './types';

export interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (body: LoginRequest) => Promise<AuthUser>;
    register: (body: RegisterRequest) => Promise<AuthUser>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
