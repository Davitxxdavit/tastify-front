import { io, type Socket } from 'socket.io-client';
import { API_ORIGIN } from '../env';
import { refreshAccessToken } from '../http/api-client';
import { tokenStorage } from '../http/token-storage';

/** Socket.IO namespaces exposed by the backend gateways. */
export type Namespace = '/orders' | '/chat';
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ManagedSocket {
    socket: Socket;
    users: number;
    status: ConnectionStatus;
    listeners: Set<() => void>;
    authRetries: number;
}

const MAX_AUTH_RETRIES = 2;
const sockets = new Map<Namespace, ManagedSocket>();

function setStatus(managed: ManagedSocket, status: ConnectionStatus) {
    if (managed.status === status) return;
    managed.status = status;
    managed.listeners.forEach((listener) => listener());
}

function create(namespace: Namespace): ManagedSocket {
    const socket = io(`${API_ORIGIN}${namespace}`, {
        autoConnect: false,
        // Read the token on every (re)connect so a refreshed token is picked up
        auth: (cb) => cb({ token: tokenStorage.getAccessToken() }),
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10_000,
    });
    const managed: ManagedSocket = { socket, users: 0, status: 'disconnected', listeners: new Set(), authRetries: 0 };

    socket.on('connect', () => {
        managed.authRetries = 0;
        setStatus(managed, 'connected');
    });
    socket.io.on('reconnect_attempt', () => setStatus(managed, 'connecting'));
    socket.on('connect_error', () => setStatus(managed, socket.active ? 'connecting' : 'disconnected'));
    socket.on('disconnect', async (reason) => {
        if (reason !== 'io server disconnect') {
            // Network drop: socket.io reconnects on its own
            setStatus(managed, 'connecting');
            return;
        }
        // The gateway disconnects sockets with a missing/expired token. Refresh and retry.
        setStatus(managed, 'disconnected');
        if (managed.users === 0 || managed.authRetries >= MAX_AUTH_RETRIES) return;
        managed.authRetries++;
        try {
            await refreshAccessToken();
            if (managed.users > 0) {
                setStatus(managed, 'connecting');
                socket.connect();
            }
        } catch {
            // Refresh failed: the API client's session handling logs the user out
        }
    });

    return managed;
}

function getManaged(namespace: Namespace) {
    let managed = sockets.get(namespace);
    if (!managed) {
        managed = create(namespace);
        sockets.set(namespace, managed);
    }
    return managed;
}

/** Returns the shared socket for a namespace and connects it. Pair with releaseSocket. */
export function acquireSocket(namespace: Namespace): Socket {
    const managed = getManaged(namespace);
    managed.users++;
    if (!managed.socket.connected && !managed.socket.active) {
        setStatus(managed, 'connecting');
        managed.socket.connect();
    }
    return managed.socket;
}

/** Disconnects the namespace once its last user releases it. */
export function releaseSocket(namespace: Namespace) {
    const managed = sockets.get(namespace);
    if (!managed) return;
    managed.users = Math.max(0, managed.users - 1);
    if (managed.users === 0) {
        managed.socket.disconnect();
        setStatus(managed, 'disconnected');
    }
}

/** Closes every socket, e.g. on logout. */
export function disconnectAllSockets() {
    for (const managed of sockets.values()) {
        managed.socket.disconnect();
        setStatus(managed, 'disconnected');
    }
}

export function getConnectionStatus(namespace: Namespace): ConnectionStatus {
    return sockets.get(namespace)?.status ?? 'disconnected';
}

export function subscribeConnectionStatus(namespace: Namespace, listener: () => void) {
    const managed = getManaged(namespace);
    managed.listeners.add(listener);
    return () => {
        managed.listeners.delete(listener);
    };
}

interface AckResponse {
    success?: boolean;
    error?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Emits a room-join event and waits for the gateway's ack. The gateway
 * authenticates asynchronously after the handshake, so a join sent right
 * after `connect` can be answered with "Unauthorized"; retry with backoff.
 */
export async function joinRoom(socket: Socket, event: string, payload: object, attempts = 5): Promise<AckResponse> {
    let last: AckResponse = { error: 'Not connected' };
    for (let attempt = 0; attempt < attempts; attempt++) {
        if (!socket.connected) return { error: 'Not connected' };
        try {
            last = (await socket.timeout(5000).emitWithAck(event, payload)) as AckResponse;
        } catch {
            last = { error: 'Timed out' };
        }
        if (!last.error || !['Unauthorized', 'Rate limit exceeded', 'Timed out'].includes(last.error)) {
            return last;
        }
        await sleep(200 * (attempt + 1));
    }
    return last;
}
