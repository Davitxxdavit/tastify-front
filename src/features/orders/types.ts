import { z } from 'zod';
import { decimalSchema, isoDateSchema } from '../../lib/schemas';
import { addressSchema } from '../account/types';

// Prisma enums
export const ORDER_STATUSES = ['PENDING', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELLED'] as const;
export const orderStatusSchema = z.enum(ORDER_STATUSES);
export const orderTypeSchema = z.enum(['INSTANT', 'SCHEDULED']);
export const deliveryTypeSchema = z.enum(['OWN', 'GLOVO', 'PICKUP']);
export const paymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']);
export const paymentMethodSchema = z.enum(['CASH', 'CARD']);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderType = z.infer<typeof orderTypeSchema>;
export type DeliveryType = z.infer<typeof deliveryTypeSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const TERMINAL_STATUSES: readonly OrderStatus[] = ['COMPLETED', 'CANCELLED'];

const orderItemModifierSchema = z.object({
    id: z.string(),
    orderItemId: z.string(),
    modifierId: z.number().int(),
    price: decimalSchema,
    modifier: z.object({
        id: z.number().int(),
        name: z.string(),
    }),
});

const orderItemSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    itemId: z.number().int(),
    quantity: z.number().int(),
    price: decimalSchema,
    item: z.object({
        id: z.number().int(),
        name: z.string(),
        imageUrl: z.string().nullable(),
    }),
    modifiers: z.array(orderItemModifierSchema),
});

export const statusHistoryEntrySchema = z.object({
    id: z.string(),
    orderId: z.string(),
    status: orderStatusSchema,
    changedAt: isoDateSchema,
    changedBy: z.string().nullable(),
    notes: z.string().nullable(),
});

// GET /orders returns orders without statusHistory; GET /orders/:id includes it
export const orderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    status: orderStatusSchema,
    type: orderTypeSchema,
    scheduledFor: isoDateSchema.nullable(),
    paymentStatus: paymentStatusSchema,
    paymentMethod: paymentMethodSchema,
    deliveryType: deliveryTypeSchema,
    totalPrice: decimalSchema,
    addressId: z.string().nullable(),
    contactPhone: z.string().nullable(),
    notes: z.string().nullable(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
    address: addressSchema.nullable(),
    items: z.array(orderItemSchema),
    statusHistory: z.array(statusHistoryEntrySchema).optional(),
});

export const ordersSchema = z.array(orderSchema);

export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type StatusHistoryEntry = z.infer<typeof statusHistoryEntrySchema>;

/** Body of POST /orders (CreateOrderDto). */
export interface CreateOrderRequest {
    type: OrderType;
    deliveryType: DeliveryType;
    scheduledFor?: string;
    addressId?: string;
    paymentMethod?: PaymentMethod;
    contactPhone?: string;
    notes?: string;
    items: {
        itemId: number;
        quantity: number;
        price: number;
        modifiers?: { modifierId: number; price: number }[];
    }[];
}
