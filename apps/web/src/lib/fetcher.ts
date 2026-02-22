import Cookies from 'js-cookie';
import { ApiResponse } from '@repo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const fetcher = async <T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    let token: string | undefined;

    if (typeof window === 'undefined') {
        // Серверний компонент
        const { cookies } = await import('next/headers');
        token = (await cookies()).get('accessToken')?.value;
    } else {
        // Клієнтський компонент
        token = Cookies.get('accessToken');

        // ДЕБАГ: Перевір у консолі браузера, чи читається токен взагалі
        // Якщо тут undefined, значить кука HttpOnly
        console.log('Client-side token:', token ? 'Found' : 'Missing!');
    }

    const isFormData = options.body instanceof FormData;

    // Формуємо заголовки правильно
    const finalHeaders: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (token) {
        finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: finalHeaders,
            credentials: 'include', // ОДНОЗНАЧНО ДОДАТИ ЦЕ! Дозволяє відправку куків на localhost:3001
        });

        if (response.status === 204) {
            return { success: true, data: {} as T };
        }

        const data = await response.json();

        // Можна також додати глобальний перехват 401/403 для редиректу на логін
        if (!response.ok) {
            console.error(`Fetch error [${response.status}]:`, data);
        }

        return data as ApiResponse<T>;

    } catch (error) {
        return {
            success: false,
            error: {
                status: 500,
                code: 'NETWORK_OR_SERVER_ERROR',
                message: 'Could not connect to the server. Check your connection.',
                details: error instanceof Error ? error.message : String(error),
            },
        };
    }
};