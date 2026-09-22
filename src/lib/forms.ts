import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toApiError } from './http/api-error';

/**
 * Puts API errors on the form: validation messages whose DTO property is in
 * `fieldMap` go on that field, everything else becomes the root error.
 * Returns the root message (if any) for callers that also want a toast.
 */
export function applyApiErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    fieldMap: Record<string, Path<T>>,
): string | null {
    const apiError = toApiError(error);
    const unmapped: string[] = [];
    let focused = false;

    for (const message of apiError.messages) {
        const entry = Object.entries(apiError.fieldErrors).find(([, fieldMessage]) => fieldMessage === message);
        const field = entry && fieldMap[entry[0]];
        if (field) {
            setError(field, { type: 'server', message }, { shouldFocus: !focused });
            focused = true;
        } else {
            unmapped.push(message);
        }
    }

    if (unmapped.length > 0) {
        const rootMessage = unmapped.join(' ');
        setError('root.server', { type: 'server', message: rootMessage });
        return rootMessage;
    }
    return null;
}
