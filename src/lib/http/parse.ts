import type { ZodType, ZodTypeDef } from 'zod';
import { ApiError } from './api-error';

/**
 * Validates an API response at the boundary. A mismatch means the backend
 * contract changed, so fail loudly instead of rendering half-broken data.
 */
export function parseResponse<Output>(
    schema: ZodType<Output, ZodTypeDef, unknown>,
    data: unknown,
    label: string,
): Output {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error(`Unexpected ${label} response`, result.error.issues);
        throw new ApiError(-1, [`The server sent an unexpected ${label} response.`]);
    }
    return result.data;
}
