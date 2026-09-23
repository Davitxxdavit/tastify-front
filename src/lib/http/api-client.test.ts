import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { API, apiError, envelope, server } from '../../test/msw';
import { makeSession } from '../../test/fixtures';
import { api } from './api-client';
import { ApiError } from './api-error';
import { onSessionExpired, tokenStorage } from './token-storage';

/** Protected endpoint that only accepts the given access token. */
function protectedEndpoint(validToken: string, body: unknown = { ok: true }) {
    return http.get(`${API}/orders`, ({ request }) =>
        request.headers.get('Authorization') === `Bearer ${validToken}` ? envelope(body) : apiError(401, 'Unauthorized', 'Unauthorized'),
    );
}

describe('api client', () => {
    afterEach(() => tokenStorage.clear());

    it('attaches the access token and unwraps the { data, statusCode } envelope', async () => {
        tokenStorage.setSession(makeSession('1'));
        server.use(protectedEndpoint('access-1', [{ id: 'o1' }]));
        const { data } = await api.get('/orders');
        expect(data).toEqual([{ id: 'o1' }]);
    });

    it('refreshes once for concurrent 401s, rotates the tokens and retries every request', async () => {
        tokenStorage.setSession({ ...makeSession('old'), accessToken: 'expired' });
        const refreshBodies: unknown[] = [];
        server.use(
            protectedEndpoint('access-refreshed'),
            http.post(`${API}/auth/refresh`, async ({ request }) => {
                refreshBodies.push(await request.json());
                // Slow enough that all three 401s arrive while this is in flight
                await new Promise((resolve) => setTimeout(resolve, 50));
                return envelope(makeSession('refreshed'));
            }),
        );

        const results = await Promise.all([api.get('/orders'), api.get('/orders'), api.get('/orders')]);

        expect(results.map((r) => r.data)).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
        expect(refreshBodies).toEqual([{ refreshToken: 'refresh-old' }]);
        expect(tokenStorage.getAccessToken()).toBe('access-refreshed');
        expect(tokenStorage.getRefreshToken()).toBe('refresh-refreshed');
    });

    it('logs the user out when the refresh token is rejected', async () => {
        tokenStorage.setSession({ ...makeSession('old'), accessToken: 'expired' });
        const expired = vi.fn();
        const unsubscribe = onSessionExpired(expired);
        server.use(protectedEndpoint('never'), http.post(`${API}/auth/refresh`, () => apiError(401, 'Invalid refresh token', 'Unauthorized')));

        await expect(api.get('/orders')).rejects.toMatchObject({ status: 401 });
        expect(expired).toHaveBeenCalledTimes(1);
        expect(tokenStorage.getAccessToken()).toBeNull();
        expect(tokenStorage.getRefreshToken()).toBeNull();
        unsubscribe();
    });

    it("doesn't try to refresh when login itself fails", async () => {
        const refresh = vi.fn();
        server.use(
            http.post(`${API}/auth/login`, () => apiError(401, 'Invalid credentials', 'Unauthorized')),
            http.post(`${API}/auth/refresh`, () => {
                refresh();
                return HttpResponse.error();
            }),
        );
        const error = await api.post('/auth/login', { email: 'x@y.ge', password: 'wrong1' }).catch((e) => e);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe('Invalid credentials');
        expect(refresh).not.toHaveBeenCalled();
    });

    it('normalizes network failures', async () => {
        server.use(http.get(`${API}/menu/categories`, () => HttpResponse.error()));
        await expect(api.get('/menu/categories')).rejects.toMatchObject({ status: 0, isNetworkError: true });
    });
});
