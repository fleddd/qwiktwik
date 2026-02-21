import { Plan, SubStatus, Role } from '@repo/database'; // або звідки ти їх експортуєш

export interface UserProfileResponse {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role: Role;
    subscription: {
        plan: Plan;
        status: SubStatus;
        currentPeriodEnd: Date | null;
    } | null;
}

export interface AuthResponse {
    accessToken: string;
    user: UserProfileResponse;
}


// Це імпортуватимуть і NestJS, і Next.js
export interface ApiErrorResponse {
    success: false;
    error: {
        status: number;
        code: string;
        message: string;
        details?: any; // Для помилок валідації Zod або class-validator
    };
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;