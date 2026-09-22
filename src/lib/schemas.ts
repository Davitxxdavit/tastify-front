import { z } from 'zod';

/** Prisma Decimal columns are serialized as strings ("12.99"). */
export const decimalSchema = z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value), { message: 'Expected a decimal number' });

export const isoDateSchema = z.string().datetime({ offset: true });
