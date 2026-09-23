import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';
import OrderDetail from './OrderDetail';
import { API, envelope, server } from '../test/msw';
import { makeOrder } from '../test/fixtures';
import { renderWithProviders } from '../test/render';
import { FakeSocket } from '../test/fake-socket';

const socket = vi.hoisted(() => ({ current: null as unknown as FakeSocket }));

vi.mock('../lib/realtime/socket', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/realtime/socket')>();
    return {
        ...actual,
        acquireSocket: vi.fn(() => socket.current),
        releaseSocket: vi.fn(),
        getConnectionStatus: () => 'connected',
        subscribeConnectionStatus: () => () => {},
    };
});

const ORDER_ID = 'a1b2c3d4-0000-4000-8000-000000000001';

/** Serves the order with whatever status the "backend" currently has. */
function serveOrder(initial: string) {
    const state = { status: initial, requests: 0 };
    server.use(
        http.get(`${API}/orders/:id`, () => {
            state.requests++;
            return envelope(makeOrder({ id: ORDER_ID, status: state.status }));
        }),
    );
    return state;
}

function renderOrder() {
    return renderWithProviders(null, {
        route: `/orders/${ORDER_ID}`,
        authenticated: true,
        routes: [{ path: '/orders/:orderId', element: <OrderDetail /> }],
    });
}

const currentStep = () => document.querySelector('[aria-current="step"]');

describe('Order tracking', () => {
    beforeEach(() => {
        socket.current = new FakeSocket();
    });

    it('joins the order room over the socket', async () => {
        serveOrder('PENDING');
        renderOrder();
        await screen.findByRole('heading', { name: /order #a1b2c3d4/i });

        await waitFor(() => expect(socket.current.emitted).toContainEqual({ event: 'join_order_room', payload: { orderId: ORDER_ID } }));
        expect(screen.getByRole('status')).toHaveTextContent('Live');
    });

    it('updates the status and timeline when the server emits order_updated', async () => {
        const backend = serveOrder('PENDING');
        renderOrder();
        await waitFor(() => expect(currentStep()).toHaveTextContent('Received'));

        backend.status = 'PREPARING';
        act(() => socket.current.serverEmit('order_updated', { orderId: ORDER_ID, status: 'PREPARING' }));

        // Patched from the event immediately, then confirmed by the refetch
        await waitFor(() => expect(currentStep()).toHaveTextContent('Preparing'));
        expect(within(document.querySelector('header')!).getByText('Preparing')).toBeInTheDocument();
        await waitFor(() => expect(backend.requests).toBe(2));
    });

    it('ignores events for other orders', async () => {
        const backend = serveOrder('PENDING');
        renderOrder();
        await waitFor(() => expect(currentStep()).toHaveTextContent('Received'));

        act(() => socket.current.serverEmit('order_updated', { orderId: 'someone-else', status: 'COMPLETED' }));

        expect(currentStep()).toHaveTextContent('Received');
        expect(backend.requests).toBe(1);
    });

    it('rejoins and refetches after a reconnect to catch missed updates', async () => {
        const backend = serveOrder('PREPARING');
        renderOrder();
        await waitFor(() => expect(currentStep()).toHaveTextContent('Preparing'));
        await waitFor(() => expect(socket.current.emitted.filter((e) => e.event === 'join_order_room')).toHaveLength(1));

        // The courier picked it up while we were offline
        backend.status = 'DELIVERING';
        act(() => socket.current.reconnect());

        await waitFor(() => expect(currentStep()).toHaveTextContent('On the way'));
        expect(socket.current.emitted.filter((e) => e.event === 'join_order_room')).toHaveLength(2);
    });

    it('retries the join while the gateway is still authenticating the handshake', async () => {
        serveOrder('PENDING');
        let attempts = 0;
        socket.current.ackHandler = () => (++attempts === 1 ? { error: 'Unauthorized' } : { success: true });
        renderOrder();

        await waitFor(() => expect(attempts).toBe(2), { timeout: 2000 });
    });
});
