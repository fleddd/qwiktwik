import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(30, 'Name is too long')
        .optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z.object({
    current: z.string().min(1, 'Current password is required'),
    new: z.string().min(6, 'New password must be at least 6 characters'),
});
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;