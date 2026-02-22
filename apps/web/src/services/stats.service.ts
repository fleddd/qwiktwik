import { fetcher } from '@/lib/fetcher';

export const AdminStatsService = {
    getOverview: async () => {
        return fetcher<any>('/admin/stats/overview', {
            method: 'GET',
            cache: 'no-store', // Дані мають бути завжди свіжими
        });
    }
};