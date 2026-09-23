type Handler = (...args: unknown[]) => void;

/**
 * Minimal stand-in for a socket.io-client Socket: records emits, answers acks
 * through `ackHandler`, and lets a test push server events with `serverEmit`.
 */
export class FakeSocket {
    connected = true;
    active = true;
    emitted: { event: string; payload: unknown }[] = [];
    ackHandler: (event: string, payload: unknown) => unknown = () => ({ success: true });
    private handlers = new Map<string, Set<Handler>>();

    on(event: string, handler: Handler) {
        if (!this.handlers.has(event)) this.handlers.set(event, new Set());
        this.handlers.get(event)!.add(handler);
        return this;
    }

    off(event: string, handler: Handler) {
        this.handlers.get(event)?.delete(handler);
        return this;
    }

    emit(event: string, payload?: unknown) {
        this.emitted.push({ event, payload });
        return this;
    }

    timeout() {
        return {
            emitWithAck: async (event: string, payload: unknown) => {
                this.emitted.push({ event, payload });
                const result = this.ackHandler(event, payload);
                if (result instanceof Error) throw result;
                return result;
            },
        };
    }

    /** Simulates the server sending an event to this client. */
    serverEmit(event: string, payload?: unknown) {
        this.handlers.get(event)?.forEach((handler) => handler(payload));
    }

    /** Simulates a reconnect: fires the client's `connect` listeners again. */
    reconnect() {
        this.connected = true;
        this.serverEmit('connect');
    }

    listenerCount(event: string) {
        return this.handlers.get(event)?.size ?? 0;
    }
}
