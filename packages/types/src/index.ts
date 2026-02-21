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
    oauthAccounts?: { provider: string }[];
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



// --- DEVICES ---
export interface DeviceResponse {
    id: string;
    hwid: string;
    name: string | null;
    lastSeen: Date;
    createdAt: Date;
}

export interface VerifyDeviceResponse {
    success: boolean;
    plan: 'FREE' | 'PRO';
    isNewDevice: boolean;
}

// --- RELEASES ---
export interface ReleaseResponse {
    id: string;
    version: string;
    downloadUrl: string;
    changelog: string | null;
    createdAt: Date;
}