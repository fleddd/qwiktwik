import { fetcher } from '@/lib/fetcher';
import type { TransactionResponse } from '@repo/types';

export const BillingService = {
    createCheckout: async (interval: string) => {
        return fetcher<{ url: string }>('/billing/create-checkout', {
            method: 'POST',
            body: JSON.stringify({ interval }),
        });
    },

    getTransactions: async () => {
        return fetcher<TransactionResponse[]>('/billing/transactions', {
            method: 'GET',
        });
    }
};