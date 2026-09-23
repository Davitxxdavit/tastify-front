import { describe, expect, it } from 'vitest';
import { parseFieldErrors } from './api-error';

describe('parseFieldErrors', () => {
    it('maps class-validator messages to their property path', () => {
        expect(
            parseFieldErrors([
                'contactPhone must be a Georgian mobile number (+9955XXXXXXXX)',
                'items.0.quantity must not be less than 1',
                'property foo should not exist',
                'scheduledFor is required for scheduled orders',
            ]),
        ).toEqual({
            contactPhone: 'contactPhone must be a Georgian mobile number (+9955XXXXXXXX)',
            'items.0.quantity': 'items.0.quantity must not be less than 1',
            foo: 'property foo should not exist',
            scheduledFor: 'scheduledFor is required for scheduled orders',
        });
    });

    it('ignores plain sentences', () => {
        expect(parseFieldErrors(['Invalid credentials', 'Scheduled time must be in the future'])).toEqual({});
    });
});
