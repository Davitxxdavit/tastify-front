import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { addresses, makeChatMessage, makeOrder, makeSession, menuCategories } from './fixtures';

export const API = 'http://localhost:3000/api/v1';

/** Wraps a body in the backend's TransformInterceptor envelope. */
export const envelope = (data: unknown, statusCode = 200) => HttpResponse.json({ data, statusCode }, { status: statusCode });

/** Error body produced by the backend's AllExceptionsFilter. */
export const apiError = (statusCode: number, message: string | string[], error = 'Bad Request') =>
    HttpResponse.json({ statusCode, message, error, requestId: 'test', path: '/', timestamp: '2026-01-01T00:00:00Z' }, { status: statusCode });

// Default happy-path handlers; tests override with server.use(...)
export const handlers = [
    http.post(`${API}/auth/login`, () => envelope(makeSession())),
    http.post(`${API}/auth/refresh`, () => envelope(makeSession('refreshed'))),
    http.get(`${API}/menu/categories`, () => envelope(menuCategories)),
    http.get(`${API}/users/addresses`, () => envelope(addresses)),
    http.get(`${API}/orders`, () => envelope([makeOrder()])),
    http.get(`${API}/orders/:id`, ({ params }) => envelope(makeOrder({ id: params.id }))),
    http.get(`${API}/chat/:orderId`, ({ params }) => envelope([makeChatMessage({ orderId: params.orderId })])),
];

export const server = setupServer(...handlers);
