import { z } from 'zod';
import { decimalSchema, isoDateSchema } from '../../lib/schemas';

// Mirrors the Prisma MenuModifier / MenuItem / MenuCategory models returned by
// GET /menu/categories (categories -> active items -> modifiers).

export const menuModifierSchema = z.object({
    id: z.number().int(),
    itemId: z.number().int(),
    name: z.string(),
    price: decimalSchema,
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
});

export const menuItemSchema = z.object({
    id: z.number().int(),
    categoryId: z.number().int(),
    name: z.string(),
    description: z.string().nullable(),
    price: decimalSchema,
    imageUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
    deletedAt: isoDateSchema.nullable(),
    modifiers: z.array(menuModifierSchema),
});

export const menuCategorySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    imageUrl: z.string().nullable(),
    sortOrder: z.number().int(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema,
    deletedAt: isoDateSchema.nullable(),
    items: z.array(menuItemSchema),
});

export const menuCategoriesSchema = z.array(menuCategorySchema);

export type MenuModifier = z.infer<typeof menuModifierSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
