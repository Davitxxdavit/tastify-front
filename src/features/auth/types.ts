import { z } from 'zod';

// AuthResponseDto.user: customers have email/phone, staff have phone/role
export const authUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
    type: z.enum(['user', 'staff']),
    role: z.string().optional(),
});

// AuthResponseDto
export const authSessionSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: authUserSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;

/** Body of POST /auth/login (LoginDto): email or phone, plus password. */
export interface LoginRequest {
    email?: string;
    phone?: string;
    password: string;
}

/** Body of POST /auth/register (RegisterDto). */
export interface RegisterRequest {
    name: string;
    email?: string;
    phone?: string;
    password: string;
}
