import { BillingService } from '@/services/billing.service';
import { TransactionResponse } from '@repo/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
    const response = await BillingService.getTransactions();
    const transactions = response.success ? response.data : [];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Billing History</h1>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">
                        Your past invoices and transactions
                    </p>
                </div>
                <Link
                    href="/dashboard/billing"
                    className="text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                    ← Back to Subscription
                </Link>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-[2rem] overflow-hidden">
                {transactions && transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-text-muted font-black">
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Plan Interval</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Method</th>
                                    <th className="p-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {transactions.map((tx: TransactionResponse) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 text-white/70">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 font-bold text-white uppercase">
                                            {tx.intervalPaid}
                                        </td>
                                        <td className="p-6 font-black text-white">
                                            ${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="p-6 text-white/70 uppercase text-xs">
                                            {tx.provider === 'nowpayments' ? 'Crypto' : tx.provider}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider
                                                ${tx.status === 'COMPLETED' ? 'bg-accent/10 text-accent border border-accent/20' :
                                                    tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20 text-2xl">
                            $
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No transactions yet</h3>
                        <p className="text-xs text-text-muted mb-6 max-w-sm mx-auto">
                            It looks like you haven't made any purchases. Upgrade your plan to see your billing history here.
                        </p>
                        <Link
                            href="/dashboard/billing"
                            className="px-6 py-3 bg-white/5 text-white font-black text-xs uppercase rounded-xl hover:bg-white/10 transition-colors"
                        >
                            View Plans
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}