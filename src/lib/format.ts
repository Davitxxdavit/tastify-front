/** Formats an amount in Georgian lari, e.g. `12.50 ₾`. */
export function formatGel(amount: number) {
    return `${amount.toFixed(2)} ₾`;
}

export function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString([], {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/** Formats a Date for <input type="datetime-local"> in local time. */
export function toDateTimeLocal(date: Date) {
    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
