import { api } from '../../lib/http/api-client';
import { parseResponse } from '../../lib/http/parse';
import { authSessionSchema, type AuthSession, type LoginRequest, type RegisterRequest } from './types';

export const authApi = {
    async login(body: LoginRequest): Promise<AuthSession> {
        const { data } = await api.post<unknown>('/auth/login', body);
        return parseResponse(authSessionSchema, data, 'login');
    },

    async register(body: RegisterRequest): Promise<AuthSession> {
        const { data } = await api.post<unknown>('/auth/register', body);
        return parseResponse(authSessionSchema, data, 'registration');
    },
};
