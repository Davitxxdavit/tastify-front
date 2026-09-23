import { z } from 'zod';

/**
 * Normalizes a Georgian mobile number to E.164 (+9955XXXXXXXX).
 * Accepts "555 12 34 56", "555-123-456", "+995 555 123 456" or "995555123456".
 * Returns null when the input isn't a Georgian mobile number.
 */
export function normalizeGeorgianMobile(input: string): string | null {
    let digits = input.replace(/[\s\-()]/g, '');
    if (digits.startsWith('+')) digits = digits.slice(1);
    if (!/^\d+$/.test(digits)) return null;
    if (digits.length === 12 && digits.startsWith('995')) digits = digits.slice(3);
    return /^5\d{8}$/.test(digits) ? `+995${digits}` : null;
}

export const GEORGIAN_MOBILE_MESSAGE = 'Enter a Georgian mobile number, e.g. 555 12 34 56';

/** Form field schema: validates and outputs the E.164 number the API expects. */
export const georgianMobileSchema = z
    .string()
    .trim()
    .refine((value) => normalizeGeorgianMobile(value) !== null, GEORGIAN_MOBILE_MESSAGE)
    .transform((value) => normalizeGeorgianMobile(value)!);
