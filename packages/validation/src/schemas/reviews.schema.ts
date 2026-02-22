import { z } from 'zod';

export const CreateReviewSchema = z.object({
    rating: z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Please select at least 1 star')
        .max(5, 'Maximum rating is 5 stars'),
    text: z
        .string()
        .min(10, 'Review must be at least 10 characters long')
        .max(500, 'Review cannot exceed 500 characters'),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;