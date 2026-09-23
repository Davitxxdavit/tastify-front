import { isAxiosError } from 'axios';

/** Error body produced by the backend's AllExceptionsFilter. */
export interface ApiErrorBody {
    statusCode: number;
    message: string | string[];
    error?: string;
    requestId?: string;
    path?: string;
}

/**
 * Normalized API error. `fieldErrors` maps a DTO property path
 * (e.g. `contactPhone`, `items.0.quantity`) to its validation message.
 */
export class ApiError extends Error {
    readonly status: number;
    readonly messages: string[];
    readonly fieldErrors: Record<string, string>;
    readonly requestId?: string;

    constructor(status: number, messages: string[], requestId?: string) {
        super(messages[0] ?? 'Something went wrong');
        this.name = 'ApiError';
        this.status = status;
        this.messages = messages;
        this.fieldErrors = parseFieldErrors(messages);
        this.requestId = requestId;
    }

    get isNetworkError() {
        return this.status === 0;
    }
}

// class-validator messages start with the property path:
// "contactPhone must be ...", "items.0.quantity must not be ...", "property foo should not exist"
const FIELD_MESSAGE = /^(?:property )?([A-Za-z_$][\w$]*(?:\.[\w$]+)*) (?=must|should|is|has)/;

export function parseFieldErrors(messages: string[]): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    for (const message of messages) {
        const match = FIELD_MESSAGE.exec(message);
        if (match && !(match[1] in fieldErrors)) {
            fieldErrors[match[1]] = message;
        }
    }
    return fieldErrors;
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
    return typeof data === 'object' && data !== null && 'statusCode' in data && 'message' in data;
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError(error)) {
        if (!error.response) {
            return new ApiError(0, ["Can't reach the server. Check your connection and try again."]);
        }
        const { status, data } = error.response;
        if (isApiErrorBody(data)) {
            const messages = Array.isArray(data.message) ? data.message : [data.message];
            return new ApiError(status, messages, data.requestId);
        }
        return new ApiError(status, [error.message]);
    }

    return new ApiError(-1, [error instanceof Error ? error.message : 'Something went wrong']);
}
