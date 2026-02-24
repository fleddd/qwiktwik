import { fetcher } from '@/lib/fetcher';
import type { AffiliateStatsResponse } from '@repo/types';

export const AffiliateService = {
    getStats: async () => {
        return fetcher<AffiliateStatsResponse>('/affiliate/stats', {
            method: 'GET',
        });
    },

    setReferralCode: async (code: string) => {
        return fetcher('/affiliate/code', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    },

    setPayoutWallet: async (wallet: string) => {
        return fetcher('/affiliate/wallet', {
            method: 'POST',
            body: JSON.stringify({ wallet }),
        });
    },

    requestWithdrawal: async (amount: number) => {
        return fetcher('/affiliate/withdraw', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    }
};