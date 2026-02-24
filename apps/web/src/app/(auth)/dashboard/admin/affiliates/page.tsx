'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '@/services/user.service';
import type { AdminUserResponse, WithdrawalResponse } from '@repo/types';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Wallet, DollarSign, Clock, AlertCircle } from 'lucide-react';

// Розширений тип для відображення деталей у модалці
interface AffiliateDetails extends AdminUserResponse {
    payoutWallet: string | null;
    withdrawalRequests: WithdrawalResponse[];
}

export default function AdminAffiliatesPage() {
    const [affiliates, setAffiliates] = useState<AdminUserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Стейт для модалки
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateDetails | null>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        const res = await AdminService.getAllUsers();
        if (res.success && res.data) {
            setAffiliates(res.data.filter(u => u.role === 'AFFILIATE'));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Відкриття модалки і завантаження деталей
    const handleViewDetails = async (userId: string) => {
        setIsModalOpen(true);
        setIsDetailsLoading(true);
        setSelectedAffiliate(null);

        const res = await AdminService.getAffiliateDetails(userId);
        if (res.success) {
            setSelectedAffiliate(res.data);
        } else {
            toast.error("Failed to load details", { description: res.error?.message });
            setIsModalOpen(false);
        }
        setIsDetailsLoading(false);
    };

    // Обробка статусу виплати
    const handleUpdatePayoutStatus = async (requestId: string, status: 'COMPLETED' | 'REJECTED') => {
        const res = await AdminService.updateWithdrawalStatus(requestId, status);

        if (res.success) {
            toast.success(`Request marked as ${status}`);
            // Оновлюємо локальний стейт модалки
            if (selectedAffiliate) {
                setSelectedAffiliate({
                    ...selectedAffiliate,
                    withdrawalRequests: selectedAffiliate.withdrawalRequests.map(req =>
                        req.id === requestId ? { ...req, status } : req
                    )
                });
            }
            // Обов'язково оновлюємо зовнішню таблицю, щоб бейджі зникли/оновилися
            fetchUsers();
        } else {
            toast.error("Error updating status", { description: res.error?.message });
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
            <header>
                <h1 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-tight uppercase">Manage Affiliates</h1>
                <p className="text-text-muted text-xs md:text-sm">View partners, check balances, and process payouts.</p>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-widest text-text-muted">
                                <tr>
                                    <th className="px-5 md:px-6 py-4 font-bold">Partner</th>
                                    <th className="px-5 md:px-6 py-4 font-bold">Promo Code</th>
                                    <th className="px-5 md:px-6 py-4 font-bold">Balance</th>
                                    <th className="px-5 md:px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {affiliates.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                                            No affiliates found.
                                        </td>
                                    </tr>
                                ) : (
                                    affiliates.map((user) => {
                                        const pendingCount = user._count?.withdrawalRequests || 0;
                                        const hasPending = pendingCount > 0;

                                        return (
                                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 md:px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <p className="font-bold text-white truncate max-w-[150px] md:max-w-xs">{user.name}</p>
                                                            <p className="text-xs text-text-muted truncate">{user.email}</p>
                                                        </div>
                                                        {/* НОВЕ: Індикатор нових запитів */}
                                                        {hasPending && (
                                                            <span title={`${pendingCount} pending requests`} className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ml-2 animate-pulse">
                                                                <AlertCircle className="w-3 h-3" /> {pendingCount} Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 md:px-6 py-4 font-mono text-accent">
                                                    {user.referralCode || 'Not set'}
                                                </td>
                                                <td className="px-5 md:px-6 py-4 font-bold">
                                                    ${user.affiliateBalance?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-5 md:px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleViewDetails(user.id)}
                                                        className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-colors ${hasPending
                                                                ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                                                : 'bg-white/5 hover:bg-white/10 text-white'
                                                            }`}
                                                    >
                                                        {hasPending ? 'Review Payout' : 'Manage'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* МОДАЛКА З ДЕТАЛЯМИ ТА ВИПЛАТАМИ */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-[#131316] border border-white/10 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Partner Details</DialogTitle>
                    </DialogHeader>

                    {isDetailsLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : selectedAffiliate ? (
                        <div className="space-y-6 py-4">
                            {/* ІНФО-КАРТКИ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#050505] border border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1">Affiliate User</p>
                                    <p className="font-bold text-lg">{selectedAffiliate.name}</p>
                                    <p className="text-sm text-text-muted">{selectedAffiliate.email}</p>
                                </div>
                                <div className="bg-[#050505] border border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                        <Wallet className="w-3 h-3" /> TRC20 Wallet
                                    </p>
                                    {selectedAffiliate.payoutWallet ? (
                                        <p className="text-sm font-mono text-accent break-all">{selectedAffiliate.payoutWallet}</p>
                                    ) : (
                                        <p className="text-sm text-yellow-500">Not configured yet</p>
                                    )}
                                </div>
                                <div className="bg-[#050505] border border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" /> Current Balance
                                    </p>
                                    <p className="text-2xl font-black text-white">${selectedAffiliate.affiliateBalance.toFixed(2)}</p>
                                </div>
                                <div className="bg-[#050505] border border-white/5 p-4 rounded-2xl flex flex-col justify-center">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-1">Promo Code</p>
                                    <p className="text-lg font-mono text-white">{selectedAffiliate.referralCode || 'N/A'}</p>
                                </div>
                            </div>

                            {/* ТАБЛИЦЯ ЗАПИТІВ НА ВИПЛАТУ */}
                            <div className="border border-white/5 rounded-2xl overflow-hidden">
                                <div className="bg-white/5 p-4 border-b border-white/5">
                                    <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Withdrawal Requests
                                    </h3>
                                </div>

                                {selectedAffiliate.withdrawalRequests.length === 0 ? (
                                    <p className="p-6 text-center text-sm text-text-muted">No withdrawal requests found.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="text-xs text-text-muted">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Date</th>
                                                    <th className="px-4 py-3 font-medium">Amount</th>
                                                    <th className="px-4 py-3 font-medium">Status</th>
                                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 bg-[#050505]">
                                                {selectedAffiliate.withdrawalRequests.map((req) => (
                                                    <tr key={req.id}>
                                                        <td className="px-4 py-3 text-text-muted">
                                                            {new Date(req.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 font-bold text-white">
                                                            ${req.amount.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                req.status === 'COMPLETED' ? 'bg-accent/10 text-accent' :
                                                                    'bg-red-500/10 text-red-500'
                                                                }`}>
                                                                {req.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {req.status === 'PENDING' ? (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleUpdatePayoutStatus(req.id, 'COMPLETED')}
                                                                        className="cursor-pointer p-1.5 bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66]/20 rounded-md transition-colors"
                                                                        title="Mark as Paid"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdatePayoutStatus(req.id, 'REJECTED')}
                                                                        className="cursor-pointer p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors"
                                                                        title="Reject & Refund"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-text-muted">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}