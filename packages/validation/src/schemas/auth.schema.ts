import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must contain at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;