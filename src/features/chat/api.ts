import { api } from '../../lib/http/api-client';
import { parseResponse } from '../../lib/http/parse';
import { chatMessagesSchema, type ChatMessage } from './types';

export const chatApi = {
    /** Full chat history for an order, oldest first. */
    async getHistory(orderId: string): Promise<ChatMessage[]> {
        const { data } = await api.get<unknown>(`/chat/${orderId}`);
        return parseResponse(chatMessagesSchema, data, 'chat history');
    },
};
