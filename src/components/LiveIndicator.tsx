import { clsx } from 'clsx';
import type { Namespace } from '../lib/realtime/socket';
import { useConnectionStatus, useOnlineStatus } from '../lib/realtime/useConnectionStatus';

/** "Live" / "Reconnecting…" / "Offline" pill for a realtime namespace. */
export function LiveIndicator({ namespace }: { namespace: Namespace }) {
    const status = useConnectionStatus(namespace);
    const online = useOnlineStatus();
    const state = !online ? 'offline' : status === 'connected' ? 'live' : status === 'connecting' ? 'connecting' : 'offline';

    const label = {
        live: 'Live',
        connecting: 'Reconnecting…',
        offline: online ? 'Live updates paused' : 'Offline',
    }[state];

    return (
        <span
            role="status"
            aria-live="polite"
            className={clsx(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                state === 'live' && 'border-primary-bright/30 bg-primary-bright/10 text-primary-bright',
                state === 'connecting' && 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
                state === 'offline' && 'border-red-500/30 bg-red-500/10 text-red-300',
            )}
        >
            <span
                aria-hidden
                className={clsx(
                    'h-2 w-2 rounded-full',
                    state === 'live' && 'bg-primary-bright animate-pulse',
                    state === 'connecting' && 'bg-yellow-400 animate-pulse',
                    state === 'offline' && 'bg-red-400',
                )}
            />
            {label}
        </span>
    );
}
