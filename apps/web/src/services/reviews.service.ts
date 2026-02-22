import { fetcher } from '@/lib/fetcher';
import type { ReviewResponse } from '@repo/types';
import { CreateReviewInput } from '@repo/validation';

export interface MyReview {
    id: string;
    rating: number;
    text: string;
    createdAt: string;
}

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
        });
    },

    getMyReview: async () => {
        return fetcher<MyReview | null>(`/reviews`, {
            method: 'GET',
            cache: 'no-store',
        });
    },

    deleteReview: async () => {
        return fetcher('/reviews', {
            method: 'DELETE',
        });
    }
};

export const AdminReviewsService = {
    getAllReviews: async () => {
        return fetcher<any[]>('/reviews/admin/all', {
            method: 'GET',
        });
    },

    deleteReview: async (id: string) => {
        return fetcher(`/reviews/admin/${id}`, {
            method: 'DELETE',
        });
    }
};