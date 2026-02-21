import { fetcher } from '@/lib/fetcher';
import type { ReleaseResponse } from '@repo/types';

export const ReleasesService = {
    // Отримати найновішу версію для швидкого завантаження
    getLatest: async () => {
        return fetcher<ReleaseResponse>('/releases/latest', {
            method: 'GET',
        });
    },

    // Отримати історію всіх оновлень (Changelog)
    getAll: async () => {
        return fetcher<ReleaseResponse[]>('/releases', {
            method: 'GET',
        });
    },
};