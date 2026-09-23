/** Backend origin, e.g. http://localhost:3000 (no trailing slash). */
export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'http://localhost:3000').replace(/\/+$/, '');

/** REST base URL, matching the backend's global prefix `api/v1`. */
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
