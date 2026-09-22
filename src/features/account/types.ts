import { z } from 'zod';
import { isoDateSchema } from '../../lib/schemas';

// Mirrors the Prisma Address model returned by /users/addresses
export const addressSchema = z.object({
    id: z.string(),
    userId: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string().nullable(),
    country: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    isDefault: z.boolean(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
});

export const addressesSchema = z.array(addressSchema);

// GET /users/profile: the User model without passwordHash, plus addresses
export const profileSchema = z.object({
    id: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    name: z.string(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
    addresses: addressesSchema,
});

export type Address = z.infer<typeof addressSchema>;
export type Profile = z.infer<typeof profileSchema>;

/** Body of POST /users/addresses (CreateAddressDto). */
export interface CreateAddressRequest {
    street: string;
    city: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
}
