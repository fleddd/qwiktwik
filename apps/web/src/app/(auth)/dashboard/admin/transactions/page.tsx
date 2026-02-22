export default function AdminTransactionsPage() {
    const mockTx = [
        { id: 'tx_123', email: 'user@mail.com', amount: 59.88, provider: 'NOWPayments', status: 'COMPLETED', date: 'Feb 21, 2024' },
        { id: 'tx_124', email: 'pending@mail.com', amount: 9.99, provider: 'LemonSqueezy', status: 'PENDING', date: 'Feb 21, 2024' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Transactions</h1>
                <p className="text-text-muted text-sm">All system payments and their statuses.</p>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-widest text-text-muted">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Provider</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockTx.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{tx.email}</td>
                                    <td className="px-6 py-4 font-bold text-accent">${tx.amount}</td>
                                    <td className="px-6 py-4 text-text-muted">{tx.provider}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${tx.status === 'COMPLETED' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}