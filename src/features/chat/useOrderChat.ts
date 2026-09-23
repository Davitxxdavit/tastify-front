import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { acquireSocket, joinRoom, releaseSocket } from '../../lib/realtime/socket';
import { useAuth } from '../auth/useAuth';
import { chatApi } from './api';
import { appendMessage, isIncoming, parseSocketMessage } from './chat-logic';
import type { ChatMessage, PendingMessage } from './types';

export const chatKeys = {
    all: ['chat'] as const,
    messages: (orderId: string) => [...chatKeys.all, orderId] as const,
};

const SEND_TIMEOUT_MS = 8000;
let tempCounter = 0;

/**
 * Order chat: history from GET /chat/:orderId, live messages from the /chat
 * namespace (room chat:<orderId>), and sending over the socket so staff see
 * messages immediately. Sends are optimistic: the message shows as "sending"
 * and turns into "failed" (with retry) if the server doesn't confirm it.
 */
export function useOrderChat(orderId: string | undefined, isOpen: boolean) {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [pending, setPending] = useState<PendingMessage[]>([]);
    const [unread, setUnread] = useState(0);
    const isOpenRef = useRef(isOpen);
    const socketRef = useRef<ReturnType<typeof acquireSocket> | null>(null);

    // Opening the chat marks everything as read
    const [wasOpen, setWasOpen] = useState(isOpen);
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) setUnread(0);
    }
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    const history = useQuery({
        queryKey: chatKeys.messages(orderId ?? ''),
        queryFn: () => chatApi.getHistory(orderId!),
        enabled: !!orderId && !!user,
    });

    useEffect(() => {
        if (!orderId || !user) return;
        const socket = acquireSocket('/chat');
        socketRef.current = socket;
        let hasJoined = false;

        const join = async () => {
            const result = await joinRoom(socket, 'join_chat_room', { orderId });
            if (result.error) return;
            // Pick up anything sent while we were disconnected
            if (hasJoined) queryClient.invalidateQueries({ queryKey: chatKeys.messages(orderId) });
            hasJoined = true;
        };

        const onMessage = (payload: unknown) => {
            const message = parseSocketMessage(payload);
            if (!message || message.orderId !== orderId) return;
            queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(orderId), (prev) => appendMessage(prev, message));
            if (isIncoming(message, user.id) && !isOpenRef.current) {
                setUnread((count) => count + 1);
            }
        };

        socket.on('connect', join);
        socket.on('chat_message', onMessage);
        if (socket.connected) join();

        return () => {
            socket.off('connect', join);
            socket.off('chat_message', onMessage);
            socketRef.current = null;
            releaseSocket('/chat');
        };
    }, [orderId, user, queryClient]);

    const deliver = useCallback(
        async (tempId: string, text: string) => {
            const socket = socketRef.current;
            const fail = (error: string) =>
                setPending((list) => list.map((m) => (m.tempId === tempId ? { ...m, status: 'failed', error } : m)));

            if (!orderId || !socket?.connected) {
                fail("You're offline. Tap retry when you're back.");
                return;
            }
            try {
                const ack = (await socket.timeout(SEND_TIMEOUT_MS).emitWithAck('send_chat_message', { orderId, message: text })) as {
                    success?: boolean;
                    message?: unknown;
                    error?: string;
                };
                const saved = parseSocketMessage(ack?.message);
                if (!ack?.success || !saved) {
                    fail(ack?.error ?? 'Message not delivered');
                    return;
                }
                queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(orderId), (prev) => appendMessage(prev, saved));
                setPending((list) => list.filter((m) => m.tempId !== tempId));
            } catch {
                fail('No response from the server');
            }
        },
        [orderId, queryClient],
    );

    const send = useCallback(
        (text: string) => {
            const message = text.trim();
            if (!message) return;
            const tempId = `temp-${Date.now()}-${tempCounter++}`;
            setPending((list) => [...list, { tempId, message, sentAt: new Date().toISOString(), status: 'sending' }]);
            void deliver(tempId, message);
        },
        [deliver],
    );

    const retry = useCallback(
        (tempId: string) => {
            const item = pending.find((m) => m.tempId === tempId);
            if (!item) return;
            setPending((list) => list.map((m) => (m.tempId === tempId ? { ...m, status: 'sending', error: undefined } : m)));
            void deliver(tempId, item.message);
        },
        [pending, deliver],
    );

    const discard = useCallback((tempId: string) => setPending((list) => list.filter((m) => m.tempId !== tempId)), []);

    return { history, pending, unread, send, retry, discard };
}
