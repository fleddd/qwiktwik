import { fetcher } from '@/lib/fetcher';
import type { ReviewResponse } from '@repo/types';
import { CreateReviewInput } from '@repo/validation';

export const ReviewService = {
    submitReview: async (data: CreateReviewInput) => {
        return fetcher<{ id: string }>('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getPublicReviews: async () => {
        return fetcher<ReviewResponse[]>('/reviews', {
            method: 'GET',
            next: { revalidate: 60 } // Кешуємо на 60 секунд для швидкості лендінгу
        });
    }
};