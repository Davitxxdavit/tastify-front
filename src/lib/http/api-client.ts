import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../env';
import { toApiError } from './api-error';
import { expireSession, tokenStorage, type StoredSession } from './token-storage';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const API_TIMEOUT_MS = 15_000;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
});

// Attach the access token to every request
api.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// The backend wraps every success body as { data, statusCode }
function isEnvelope(body: unknown): body is { data: unknown; statusCode: number } {
    return typeof body === 'object' && body !== null && 'data' in body && 'statusCode' in body;
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/staff/login'];
const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((endpoint) => url.endsWith(endpoint));

let refreshPromise: Promise<string> | null = null;

/**
 * Exchanges the refresh token for a new token pair. Concurrent callers share one
 * in-flight request, so a burst of 401s triggers a single POST /auth/refresh.
 */
export function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token');
            }
            // Bare axios: this call must not go through the 401 interceptor
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, { timeout: API_TIMEOUT_MS });
            const session = (isEnvelope(response.data) ? response.data.data : response.data) as StoredSession;
            if (typeof session?.accessToken !== 'string' || typeof session.refreshToken !== 'string') {
                throw new Error('Malformed refresh response');
            }
            // Rotate: the backend issues a new refresh token on every refresh
            tokenStorage.setSession(session);
            return session.accessToken;
        })().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

api.interceptors.response.use(
    (response) => {
        if (isEnvelope(response.data)) {
            response.data = response.data.data;
        }
        return response;
    },
    async (error: AxiosError) => {
        const original = error.config as RetriableRequestConfig | undefined;

        if (error.response?.status === 401 && original && !isAuthEndpoint(original.url)) {
            if (!original._retry && tokenStorage.getRefreshToken()) {
                original._retry = true;
                try {
                    const accessToken = await refreshAccessToken();
                    original.headers.Authorization = `Bearer ${accessToken}`;
                    return api(original);
                } catch {
                    expireSession();
                }
            } else if (tokenStorage.getAccessToken()) {
                // Retried request still unauthorized, or no refresh token at all
                expireSession();
            }
        }

        return Promise.reject(toApiError(error));
    },
);
