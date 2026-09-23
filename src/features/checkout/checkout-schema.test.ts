import { describe, expect, it } from 'vitest';
import { normalizeGeorgianMobile } from '../../lib/phone';
import { addLine } from '../cart/cart-logic';
import { CARD_COMING_SOON, createCheckoutSchema, NEW_ADDRESS, toAddressRequest, toOrderRequest, type CheckoutInput } from './checkout-schema';

const NOW = new Date('2026-09-23T12:00:00Z');
const schema = createCheckoutSchema(() => NOW);

const valid: CheckoutInput = {
    addressChoice: 'address-1',
    street: '',
    building: '',
    apartment: '',
    city: 'Batumi',
    phone: '555 12 34 56',
    instructions: '',
    timing: 'INSTANT',
    scheduledFor: '',
    paymentMethod: 'CASH',
};

const errorsFor = (input: Partial<CheckoutInput>) => {
    const result = schema.safeParse({ ...valid, ...input });
    return result.success ? {} : Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message]));
};

describe('Georgian mobile numbers', () => {
    it.each([
        ['555 12 34 56', '+995555123456'],
        ['555-123-456', '+995555123456'],
        ['+995 599 12 34 56', '+995599123456'],
        ['995599123456', '+995599123456'],
    ])('normalizes %s', (input, expected) => {
        expect(normalizeGeorgianMobile(input)).toBe(expected);
    });

    it.each(['12345', '322 12 34 56', '+1 555 123 4567', '55512345a'])('rejects %s', (input) => {
        expect(normalizeGeorgianMobile(input)).toBeNull();
    });
});

describe('checkout schema', () => {
    it('accepts a valid instant cash order and outputs an E.164 phone', () => {
        const result = schema.parse(valid);
        expect(result.phone).toBe('+995555123456');
    });

    it('reports every problem at once', () => {
        expect(errorsFor({ phone: '123', timing: 'SCHEDULED', scheduledFor: '' })).toEqual({
            phone: 'Enter a Georgian mobile number, e.g. 555 12 34 56',
            scheduledFor: 'Pick a delivery date and time',
        });
    });

    it('requires street and city for a new address', () => {
        expect(errorsFor({ addressChoice: NEW_ADDRESS, street: '', city: '' })).toEqual({
            street: 'Enter your street and house number',
            city: 'Enter your city',
        });
    });

    it('limits scheduled delivery to 30 minutes .. 30 days ahead', () => {
        const at = (minutes: number) => new Date(NOW.getTime() + minutes * 60_000).toISOString();
        expect(errorsFor({ timing: 'SCHEDULED', scheduledFor: at(10) }).scheduledFor).toMatch(/at least 30 minutes/);
        expect(errorsFor({ timing: 'SCHEDULED', scheduledFor: at(31 * 24 * 60) }).scheduledFor).toMatch(/up to 30 days/);
        expect(errorsFor({ timing: 'SCHEDULED', scheduledFor: at(90) })).toEqual({});
    });

    it('does not allow card payments yet', () => {
        expect(errorsFor({ paymentMethod: 'CARD' }).paymentMethod).toBe(CARD_COMING_SOON);
    });

    it('limits instructions to 500 characters', () => {
        expect(errorsFor({ instructions: 'x'.repeat(501) }).instructions).toMatch(/500/);
    });
});

describe('request builders', () => {
    it('folds building and apartment into the street line', () => {
        const values = schema.parse({ ...valid, addressChoice: NEW_ADDRESS, street: 'Gorgiladze St 45', building: '2', apartment: '14' });
        expect(toAddressRequest(values, true)).toEqual({ street: 'Gorgiladze St 45, bldg 2, apt 14', city: 'Batumi', isDefault: true });
    });

    it('builds the CreateOrderDto body with modifiers, phone, notes and schedule', () => {
        // Local time the next day, so it's in range in any timezone
        const scheduledFor = '2026-09-24T15:30';
        const values = schema.parse({ ...valid, instructions: 'Ring twice', timing: 'SCHEDULED', scheduledFor });
        const lines = addLine([], { itemId: 8, name: 'Adjarian Khachapuri', imageUrl: null, unitPrice: 18, modifiers: [{ id: 11, name: 'Extra egg', price: 1.5 }] });

        expect(toOrderRequest(values, 'address-1', lines)).toEqual({
            type: 'SCHEDULED',
            deliveryType: 'OWN',
            addressId: 'address-1',
            paymentMethod: 'CASH',
            contactPhone: '+995555123456',
            notes: 'Ring twice',
            scheduledFor: new Date(scheduledFor).toISOString(),
            items: [{ itemId: 8, quantity: 1, price: 18, modifiers: [{ modifierId: 11, price: 1.5 }] }],
        });
    });
});
