import { z } from 'zod';
import { isoDateSchema } from '../../lib/schemas';

// Prisma Chat model with the user/staff relations included by the backend
export const chatMessageSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    userId: z.string().nullable(),
    staffId: z.string().nullable(),
    message: z.string(),
    sentAt: isoDateSchema,
    user: z.object({ id: z.string(), name: z.string() }).nullable(),
    staff: z.object({ id: z.string(), name: z.string() }).nullable(),
});

export const chatMessagesSchema = z.array(chatMessageSchema);

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/** A message typed by the user that the server hasn't confirmed yet. */
export interface PendingMessage {
    tempId: string;
    message: string;
    sentAt: string;
    status: 'sending' | 'failed';
    error?: string;
}

export const MAX_MESSAGE_LENGTH = 1000;
