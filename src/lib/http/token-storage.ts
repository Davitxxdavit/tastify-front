const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export interface StoredSession {
    accessToken: string;
    refreshToken: string;
    user: unknown;
}

type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export const tokenStorage = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

    getUser(): unknown {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    setSession({ accessToken, refreshToken, user }: StoredSession) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clear() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

/** Called when the session can no longer be refreshed; the auth layer logs the user out. */
export function onSessionExpired(listener: SessionExpiredListener) {
    sessionExpiredListeners.add(listener);
    return () => {
        sessionExpiredListeners.delete(listener);
    };
}

export function expireSession() {
    tokenStorage.clear();
    sessionExpiredListeners.forEach((listener) => listener());
}
