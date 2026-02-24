import { fetcher } from '@/lib/fetcher';
import type { AdminUserResponse, UserProfileResponse } from '@repo/types';

export const UsersService = {
    updateProfile: async (data: { name: string }) => {
        return fetcher<UserProfileResponse>('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    updatePassword: async (data: { current: string; new: string }) => {
        return fetcher('/users/me/password', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    disconnectProvider: async (provider: 'google' | 'discord') => {
        return fetcher(`/users/me/connections/${provider}`, {
            method: 'DELETE',
        });
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetcher<{ avatarUrl: string }>('/users/me/avatar', {
            method: 'POST',
            body: formData,
            headers: {}
        });
    }
};


export const AdminService = {
    getAllUsers: async () => {
        return fetcher<AdminUserResponse[]>('/users', {
            method: 'GET',
        });
    },

    updateUser: async (id: string, data: { role?: string; plan?: string }) => {
        return fetcher(`/users/${id}/admin`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    getAffiliateDetails: async (userId: string) => {
        return fetcher<any>(`/users/${userId}/affiliate-details`, {
            method: 'GET',
        });
    },

    updateWithdrawalStatus: async (requestId: string, status: 'COMPLETED' | 'REJECTED') => {
        return fetcher(`/users/withdrawals/${requestId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

};