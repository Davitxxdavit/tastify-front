import { useCallback, useSyncExternalStore } from 'react';
import { getConnectionStatus, subscribeConnectionStatus, type Namespace } from './socket';

export function useConnectionStatus(namespace: Namespace) {
    const subscribe = useCallback((listener: () => void) => subscribeConnectionStatus(namespace, listener), [namespace]);
    return useSyncExternalStore(subscribe, () => getConnectionStatus(namespace));
}

function subscribeOnline(listener: () => void) {
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);
    return () => {
        window.removeEventListener('online', listener);
        window.removeEventListener('offline', listener);
    };
}

/** Browser network state (navigator.onLine). */
export function useOnlineStatus() {
    return useSyncExternalStore(subscribeOnline, () => navigator.onLine);
}
