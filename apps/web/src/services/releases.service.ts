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


export const AdminReleasesService = {
    getAll: async () => {
        return fetcher<any[]>('/releases/admin/all', {
            method: 'GET',
        });
    },

    create: async (data: { version: string; downloadUrl: string; changelog?: string; isActive: boolean }) => {
        return fetcher<any>('/releases/admin', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<{ version: string; downloadUrl: string; changelog: string; isActive: boolean }>) => {
        return fetcher<any>(`/releases/admin/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return fetcher<any>(`/releases/admin/${id}`, {
            method: 'DELETE',
        });
    }
};