import { Plan, SubStatus, Role, BillingInterval, TxStatus } from '@repo/database'; // або звідки ти їх експортуєш

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

export interface TransactionResponse {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    provider: string;
    providerTxId: string | null;
    status: TxStatus;
    intervalPaid: BillingInterval;
    createdAt: string;
    updatedAt: string;
}


export interface ReviewResponse {
    id: string;
    userId: string;
    rating: number;
    text: string;
    createdAt: string;
    user: {
        name: string | null;
        avatar: string | null;
        subscription: {
            plan: Plan;
        } | null;
    };
}


export interface AdminUserResponse {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    referralCode: string | null;
    affiliateBalance: number;
    createdAt: string;
    subscription: {
        plan: Plan;
        status: SubStatus;
    } | null;
    _count?: {
        withdrawalRequests: number;
    };
}

export interface ReferralUser {
    id: string;
    name: string | null;
    createdAt: string;
    subscription: {
        plan: Plan;
        status: SubStatus;
    } | null;
    revenueGenerated: number;
}

export interface WithdrawalResponse {
    id: string;
    amount: number;
    walletAddress: string;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED';
    createdAt: string;
}

export interface AffiliateStatsResponse {
    referralCode: string | null;
    balance: number;
    payoutWallet: string | null;
    totalReferrals: number;
    referrals: ReferralUser[];
    recentWithdrawals: WithdrawalResponse[];
}