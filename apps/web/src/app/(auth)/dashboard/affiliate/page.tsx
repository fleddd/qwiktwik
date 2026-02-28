'use client';

import { useState, useEffect } from 'react';
import { AffiliateService } from '@/services/affiliate.service';
import type { AffiliateStatsResponse, ReferralUser, WithdrawalResponse } from '@repo/types';
import { toast } from 'sonner'; // <-- Імпорт Sonner
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Copy, Check, ExternalLink, Wallet, DollarSign } from 'lucide-react';

export default function AffiliateDashboard() {
    const [stats, setStats] = useState<AffiliateStatsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [newCode, setNewCode] = useState('');
    const [newWallet, setNewWallet] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const [isCopied, setIsCopied] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchStats = async () => {
        setIsLoading(true);
        const res = await AffiliateService.getStats();
        if (res.success) {
            setStats(res.data);
            setNewCode(res.data.referralCode || '');
            setNewWallet(res.data.payoutWallet || '');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSaveCode = async () => {
        const res = await AffiliateService.setReferralCode(newCode);
        if (res.success) {
            toast.success("Success", { description: "Promo code saved successfully!" });
            fetchStats();
        } else {
            toast.error("Error", { description: res.error?.message });
        }
    };

    const handleSaveWallet = async () => {
        const res = await AffiliateService.setPayoutWallet(newWallet);
        if (res.success) {
            toast.success("Success", { description: "Wallet address saved!" });
        } else {
            toast.error("Error", { description: res.error?.message });
        }
    };

    const handleWithdrawClick = () => {
        const amount = Number(withdrawAmount);
        if (!amount || amount < 20) {
            return toast.error("Invalid amount", { description: "Minimum withdrawal is $20." });
        }
        if (!stats?.payoutWallet) {
            return toast.error("No wallet", { description: "Please set your payout wallet first." });
        }
        if (amount > (stats?.balance || 0)) {
            return toast.error("Insufficient funds", { description: "You don't have enough balance." });
        }
        setIsWithdrawModalOpen(true);
    };

    const confirmWithdrawal = async () => {
        setIsWithdrawing(true);
        const res = await AffiliateService.requestWithdrawal(Number(withdrawAmount));
        if (res.success) {
            toast.success("Request Sent!", { description: "Your withdrawal is now pending approval." });
            setIsWithdrawModalOpen(false);
            setWithdrawAmount('');
            fetchStats();
        } else {
            toast.error("Error", { description: res.error?.message });
        }
        setIsWithdrawing(false);
    };

    const handleCopyLink = () => {
        if (!stats?.referralCode) {
            return toast.error("No code", { description: "Please set your Promo Code first!" });
        }
        const link = `${window.location.origin}/ref/${stats.referralCode}`;
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        toast.success("Copied", { description: "Link copied to clipboard!" });
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 uppercase tracking-tight">Partner Dashboard</h1>
                    <p className="text-text-muted text-xs md:text-sm">Manage your referrals, settings and payouts.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* BALANCE CARD */}
                <div className="bg-charcoal border border-white/5 p-5 md:p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-text-muted text-xs md:text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-accent" /> Available Balance
                        </h2>
                        <p className="text-4xl md:text-5xl font-black text-accent mb-6">${stats?.balance.toFixed(2)}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                            <input
                                type="number"
                                placeholder="Amount (Min $20)"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleWithdrawClick}
                            disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                            className="w-full bg-accent text-black font-bold py-3 rounded-xl hover:bg-accent-hover transition disabled:opacity-50 disabled:hover:bg-accent flex items-center justify-center gap-2"
                        >
                            Request Payout
                        </button>
                    </div>
                </div>

                {/* SETTINGS CARD */}
                <div className="bg-charcoal border border-white/5 p-5 md:p-6 rounded-3xl space-y-6">
                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Your Promo Code</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                value={newCode} onChange={(e) => setNewCode(e.target.value)}
                                placeholder="e.g. SLIDAN"
                                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white uppercase focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button onClick={handleSaveCode} className="shrink-0 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition">
                                Save
                            </button>
                        </div>

                        {stats?.referralCode && (
                            <div className="bg-[#050505] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                                <p className="text-xs font-mono text-accent truncate">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/ref/${stats.referralCode}` : ''}
                                </p>
                                <button
                                    onClick={handleCopyLink}
                                    className={`shrink-0 p-2 rounded-lg transition-colors flex items-center justify-center ${isCopied ? 'bg-accent text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] text-text-muted mt-2">Users get 3 Days PRO when using this code or link.</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Wallet className="w-3 h-3" /> USDT (TRC20) Wallet
                        </label>
                        <div className="flex gap-2">
                            <input
                                value={newWallet} onChange={(e) => setNewWallet(e.target.value)}
                                placeholder="T..."
                                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
                            />
                            <button onClick={handleSaveWallet} className="shrink-0 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL REQUESTS */}
            {stats?.recentWithdrawals && stats.recentWithdrawals.length > 0 && (
                <div className="bg-charcoal border border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-5 md:p-6 border-b border-white/5">
                        <h2 className="text-lg font-bold">Payout History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 text-xs uppercase tracking-widest text-text-muted">
                                <tr>
                                    <th className="px-5 md:px-6 py-3 font-bold">Date</th>
                                    <th className="px-5 md:px-6 py-3 font-bold">Amount</th>
                                    <th className="px-5 md:px-6 py-3 font-bold">Wallet</th>
                                    <th className="px-5 md:px-6 py-3 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.recentWithdrawals.map((req: WithdrawalResponse) => (
                                    <tr key={req.id} className="hover:bg-white/[0.02]">
                                        <td className="px-5 md:px-6 py-4 text-text-muted">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 md:px-6 py-4 font-bold text-white">
                                            ${req.amount.toFixed(2)}
                                        </td>
                                        <td className="px-5 md:px-6 py-4 text-xs font-mono text-text-muted truncate max-w-[120px] md:max-w-xs">
                                            {req.walletAddress}
                                        </td>
                                        <td className="px-5 md:px-6 py-4 text-right">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                req.status === 'COMPLETED' ? 'bg-accent/10 text-accent' :
                                                    'bg-red-500/10 text-red-500'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* RECENT REFERRALS */}
            <div className="bg-charcoal border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Your Referrals ({stats?.totalReferrals})</h2>
                </div>

                {stats?.referrals.length === 0 ? (
                    <div className="p-8 text-center text-text-muted text-sm">
                        You haven't invited anyone yet. Share your code to start earning!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 text-xs uppercase tracking-widest text-text-muted">
                                <tr>
                                    <th className="px-5 md:px-6 py-3 font-bold">User</th>
                                    <th className="px-5 md:px-6 py-3 font-bold">Joined</th>
                                    <th className="px-5 md:px-6 py-3 font-bold">Plan</th>
                                    <th className="px-5 md:px-6 py-3 font-bold text-right">Earned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats?.referrals.map((ref: ReferralUser) => (
                                    <tr key={ref.id} className="hover:bg-white/[0.02]">
                                        <td className="px-5 md:px-6 py-4">
                                            <p className="font-bold text-white truncate max-w-[150px]">{ref.name || 'Ghost Player'}</p>
                                        </td>
                                        <td className="px-5 md:px-6 py-4 text-text-muted text-xs">
                                            {new Date(ref.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 md:px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${ref.subscription?.plan === 'PRO' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-white/10 text-white/50'}`}>
                                                {ref.subscription?.plan || 'FREE'}
                                            </span>
                                        </td>
                                        <td className="px-5 md:px-6 py-4 text-right font-bold text-accent">
                                            ${(ref.revenueGenerated || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* SHADCN WITHDRAWAL MODAL */}
            <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
                <DialogContent className="bg-charcoal border border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Confirm Payout</DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <p className="text-sm text-text-muted">
                            You are requesting a withdrawal of <span className="text-white font-bold">${Number(withdrawAmount).toFixed(2)}</span>.
                        </p>
                        <div className="bg-[#050505] border border-white/5 rounded-xl p-3">
                            <p className="text-xs text-text-muted mb-1 uppercase tracking-widest font-bold">To Wallet (TRC20)</p>
                            <p className="text-sm font-mono text-accent break-all">{stats?.payoutWallet}</p>
                        </div>
                        <p className="text-xs text-yellow-500/80 bg-yellow-500/10 p-3 rounded-xl">
                            Please verify your wallet address. Payouts are manual and usually processed within 24-72 hours.
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-end gap-2 mt-4">
                        <button
                            onClick={() => setIsWithdrawModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmWithdrawal}
                            disabled={isWithdrawing}
                            className="px-6 py-2.5 bg-accent text-black rounded-xl text-sm font-black hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {isWithdrawing ? 'Processing...' : 'Confirm Request'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}