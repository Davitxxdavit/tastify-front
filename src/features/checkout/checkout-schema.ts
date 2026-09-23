import { z } from 'zod';
import { GEORGIAN_MOBILE_MESSAGE, normalizeGeorgianMobile } from '../../lib/phone';
import { toOrderItems, type CartLine } from '../cart/cart-logic';
import type { CreateAddressRequest } from '../account/types';
import type { CreateOrderRequest } from '../orders/types';

export const NEW_ADDRESS = 'new';
export const MIN_SCHEDULE_LEAD_MINUTES = 30;
export const MAX_SCHEDULE_DAYS = 30; // backend limit
export const CARD_COMING_SOON = 'Card payments are coming soon. Please choose cash on delivery.';

/** Checkout form schema. `now` is injectable so time rules are testable. */
export function createCheckoutSchema(now: () => Date = () => new Date()) {
    return z
        .object({
            /** A saved address id, or NEW_ADDRESS. */
            addressChoice: z.string().min(1, 'Choose a delivery address'),
            street: z.string().trim(),
            building: z.string().trim().max(50, 'Keep this under 50 characters'),
            apartment: z.string().trim().max(50, 'Keep this under 50 characters'),
            city: z.string().trim(),
            // Checked in superRefine so every field error shows at once (object refinements
            // only run when all fields parse)
            phone: z.string().trim(),
            instructions: z.string().trim().max(500, 'Keep instructions under 500 characters'),
            timing: z.enum(['INSTANT', 'SCHEDULED']),
            /** Value of an <input type="datetime-local">, in the user's local time. */
            scheduledFor: z.string(),
            paymentMethod: z.enum(['CASH', 'CARD']),
        })
        .superRefine((values, ctx) => {
            if (normalizeGeorgianMobile(values.phone) === null) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: GEORGIAN_MOBILE_MESSAGE });
            }

            if (values.addressChoice === NEW_ADDRESS) {
                if (values.street.length < 3) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['street'], message: 'Enter your street and house number' });
                }
                if (values.city.length < 2) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['city'], message: 'Enter your city' });
                }
            }

            if (values.timing === 'SCHEDULED') {
                const scheduled = new Date(values.scheduledFor);
                const earliest = new Date(now().getTime() + MIN_SCHEDULE_LEAD_MINUTES * 60_000);
                const latest = new Date(now().getTime() + MAX_SCHEDULE_DAYS * 24 * 60 * 60_000);
                if (!values.scheduledFor || Number.isNaN(scheduled.getTime())) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['scheduledFor'], message: 'Pick a delivery date and time' });
                } else if (scheduled < earliest) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['scheduledFor'],
                        message: `Schedule at least ${MIN_SCHEDULE_LEAD_MINUTES} minutes from now`,
                    });
                } else if (scheduled > latest) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['scheduledFor'],
                        message: `Orders can be scheduled up to ${MAX_SCHEDULE_DAYS} days ahead`,
                    });
                }
            }

            if (values.paymentMethod === 'CARD') {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['paymentMethod'], message: CARD_COMING_SOON });
            }
        })
        // Only reached when valid: send the E.164 number the API expects
        .transform((values) => ({ ...values, phone: normalizeGeorgianMobile(values.phone)! }));
}

export type CheckoutSchema = ReturnType<typeof createCheckoutSchema>;
export type CheckoutInput = z.input<CheckoutSchema>;
export type CheckoutValues = z.output<CheckoutSchema>;

/** Maps backend DTO properties to checkout form fields for API validation errors. */
export const CHECKOUT_FIELD_MAP = {
    contactPhone: 'phone',
    notes: 'instructions',
    scheduledFor: 'scheduledFor',
    addressId: 'addressChoice',
    paymentMethod: 'paymentMethod',
    street: 'street',
    city: 'city',
} as const;

/** The address has no building/apartment fields, so they're folded into `street`. */
export function toAddressRequest(values: CheckoutValues, isFirstAddress: boolean): CreateAddressRequest {
    const parts = [
        values.street,
        values.building && `bldg ${values.building}`,
        values.apartment && `apt ${values.apartment}`,
    ].filter(Boolean);
    return { street: parts.join(', '), city: values.city, isDefault: isFirstAddress };
}

export function toOrderRequest(values: CheckoutValues, addressId: string, lines: CartLine[]): CreateOrderRequest {
    return {
        type: values.timing,
        deliveryType: 'OWN',
        addressId,
        paymentMethod: values.paymentMethod,
        contactPhone: values.phone,
        ...(values.instructions && { notes: values.instructions }),
        ...(values.timing === 'SCHEDULED' && { scheduledFor: new Date(values.scheduledFor).toISOString() }),
        items: toOrderItems(lines),
    };
}
