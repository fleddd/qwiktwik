import { fetcher } from '@/lib/fetcher';
import type { LoginInput, RegisterInput } from '@repo/validation';
import type { UserProfileResponse, AuthResponse } from '@repo/types';

export const AuthService = {
    login: async (credentials: LoginInput) => {
        return fetcher<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    register: async (data: RegisterInput) => {
        return fetcher<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getProfile: async () => {
        return fetcher<UserProfileResponse>('/auth/me', {
            method: 'GET',
        });
    },
    forgotPassword: async (data: { email: string }) => {
        return fetcher('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    resetPassword: async (data: { token: string; password: string }) => {
        return fetcher('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getGoogleAuthUrl: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
    getDiscordAuthUrl: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`,
};