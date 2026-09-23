import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { ChatWidget } from './ChatWidget';
import { DEMO_USER, makeChatMessage } from '../../../test/fixtures';
import { renderWithProviders } from '../../../test/render';
import { FakeSocket } from '../../../test/fake-socket';

const socket = vi.hoisted(() => ({ current: null as unknown as FakeSocket }));

vi.mock('../../../lib/realtime/socket', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../../lib/realtime/socket')>();
    return {
        ...actual,
        acquireSocket: vi.fn(() => socket.current),
        releaseSocket: vi.fn(),
        getConnectionStatus: () => 'connected',
        subscribeConnectionStatus: () => () => {},
    };
});

const ORDER_ID = 'a1b2c3d4-0000-4000-8000-000000000001';

function renderChat() {
    return renderWithProviders(null, {
        route: `/orders/${ORDER_ID}`,
        authenticated: true,
        routes: [{ path: '/orders/:orderId', element: <ChatWidget /> }],
    });
}

/** Acks send_chat_message like the gateway: saves and returns the message. */
function ackAsGateway(event: string, payload: unknown) {
    if (event !== 'send_chat_message') return { success: true };
    const { message } = payload as { message: string };
    return {
        success: true,
        message: makeChatMessage({ id: `saved-${message}`, orderId: ORDER_ID, userId: DEMO_USER.id, staffId: null, staff: null, user: { id: DEMO_USER.id, name: DEMO_USER.name }, message, sentAt: new Date().toISOString() }),
    };
}

describe('ChatWidget', () => {
    beforeEach(() => {
        socket.current = new FakeSocket();
        socket.current.ackHandler = ackAsGateway;
    });

    it('opens on the current order with its history and focuses the message box', async () => {
        const { user } = renderChat();
        await user.click(screen.getByRole('button', { name: 'Open chat' }));

        const dialog = screen.getByRole('dialog', { name: 'Order #a1b2c3d4' });
        expect(await within(dialog).findByText('Your order is being prepared')).toBeInTheDocument();
        expect(within(dialog).getByText('Kitchen Staff')).toBeInTheDocument();
        expect(within(dialog).getByRole('textbox', { name: 'Message' })).toHaveFocus();
        await waitFor(() => expect(socket.current.emitted).toContainEqual({ event: 'join_chat_room', payload: { orderId: ORDER_ID } }));
    });

    it('sends over the socket and shows the confirmed message once', async () => {
        const { user } = renderChat();
        await user.click(screen.getByRole('button', { name: 'Open chat' }));
        await screen.findByText('Your order is being prepared');

        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Extra napkins please{Enter}');

        const log = screen.getByRole('log', { name: 'Messages' });
        await waitFor(() => expect(within(log).getAllByText('Extra napkins please')).toHaveLength(1));
        expect(socket.current.emitted).toContainEqual({ event: 'send_chat_message', payload: { orderId: ORDER_ID, message: 'Extra napkins please' } });
        expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('');

        // The room broadcast of the same message must not duplicate it
        act(() => socket.current.serverEmit('chat_message', ackAsGateway('send_chat_message', { message: 'Extra napkins please' }).message));
        expect(within(log).getAllByText('Extra napkins please')).toHaveLength(1);
    });

    it('marks a message as failed when the server rejects it, and retries', async () => {
        socket.current.ackHandler = (event, payload) => (event === 'send_chat_message' ? { error: 'Rate limit exceeded' } : ackAsGateway(event, payload));
        const { user } = renderChat();
        await user.click(screen.getByRole('button', { name: 'Open chat' }));
        await screen.findByText('Your order is being prepared');

        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello?{Enter}');
        expect(await screen.findByText('Rate limit exceeded')).toBeInTheDocument();

        socket.current.ackHandler = ackAsGateway;
        await user.click(screen.getByRole('button', { name: /retry/i }));
        await waitFor(() => expect(screen.queryByText('Rate limit exceeded')).not.toBeInTheDocument());
        expect(screen.getByText('Hello?')).toBeInTheDocument();
    });

    it('fails fast while disconnected', async () => {
        const { user } = renderChat();
        await user.click(screen.getByRole('button', { name: 'Open chat' }));
        await screen.findByText('Your order is being prepared');

        socket.current.connected = false;
        await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Anyone there?{Enter}');
        expect(await screen.findByText("You're offline. Tap retry when you're back.")).toBeInTheDocument();
    });

    it('counts staff replies while closed and clears the badge on open', async () => {
        const { user } = renderChat();
        await waitFor(() => expect(socket.current.listenerCount('chat_message')).toBe(1));

        act(() => socket.current.serverEmit('chat_message', makeChatMessage({ id: 'msg-2', orderId: ORDER_ID, message: 'Courier is 5 minutes away' })));
        act(() => socket.current.serverEmit('chat_message', makeChatMessage({ id: 'msg-3', orderId: ORDER_ID, message: 'Almost there' })));

        const launcher = await screen.findByRole('button', { name: 'Open chat, 2 unread messages' });
        await user.click(launcher);
        expect(await screen.findByText('Almost there')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close chat', expanded: true })).toBeInTheDocument();
    });

    it('closes on Escape and returns focus to the launcher', async () => {
        const { user } = renderChat();
        await user.click(screen.getByRole('button', { name: 'Open chat' }));
        await user.keyboard('{Escape}');

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(screen.getByRole('button', { name: 'Open chat' })).toHaveFocus();
    });
});
