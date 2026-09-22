/** Only follow same-app redirects, never an absolute or protocol-relative URL. */
export function safeRedirect(target: string | null, fallback = '/menu') {
    return target && target.startsWith('/') && !target.startsWith('//') ? target : fallback;
}
