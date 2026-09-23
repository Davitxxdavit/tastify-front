import { chatMessageSchema, type ChatMessage } from './types';

/** Adds a message to a history list unless it's already there (the sender gets both the ack and the room broadcast). */
export function appendMessage(history: ChatMessage[] | undefined, message: ChatMessage): ChatMessage[] {
    const list = history ?? [];
    if (list.some((m) => m.id === message.id)) return list;
    return [...list, message].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

/** Parses a socket payload into a ChatMessage, or null if it doesn't match the contract. */
export function parseSocketMessage(payload: unknown): ChatMessage | null {
    const parsed = chatMessageSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
}

/** Messages from someone other than the current user (i.e. restaurant staff). */
export function isIncoming(message: ChatMessage, userId: string | undefined) {
    return message.userId !== userId;
}
