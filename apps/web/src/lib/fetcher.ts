import Cookies from 'js-cookie';
import { ApiResponse } from '@repo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const fetcher = async <T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    let token: string | undefined;

    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        token = (await cookies()).get('accessToken')?.value;
    } else {
        token = Cookies.get('accessToken');
    }

    const isFormData = options.body instanceof FormData;

    const defaultHeaders: Record<string, string> = isFormData
        ? {}
        : { 'Content-Type': 'application/json' };

    const finalHeaders = {
        ...defaultHeaders,
        ...options.headers,
    };

    if (isFormData) {
        delete finalHeaders['Content-Type'];
    }
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (response.status === 204) {
            return { success: true, data: {} as T };
        }

        const data = await response.json();

        return data as ApiResponse<T>;

    } catch (error) {
        return {
            success: false,
            error: {
                status: 500,
                code: 'NETWORK_OR_SERVER_ERROR',
                message: 'Не вдалося зʼєднатися з сервером. Перевірте підключення.',
                details: error instanceof Error ? error.message : String(error),
            },
        };
    }
};