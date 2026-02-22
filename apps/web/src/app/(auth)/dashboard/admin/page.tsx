import { AdminStatsService } from '@/services/stats.service'; // Перевір шлях

export default async function AdminOverviewPage() {
    const response = await AdminStatsService.getOverview();

    // Якщо сталася помилка, підставляємо нулі
    const stats = response.success && response.data ? response.data : {
        totalUsers: 0,
        proSubscriptions: 0,
        totalRevenue: 0,
        activeDevices: 0,
        recentUsers: []
    };

    // Форматуємо масив метрик для рендеру
    const metrics = [
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        },
        {
            label: 'Pro Subscriptions',
            value: stats.proSubscriptions.toLocaleString(),
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
        },
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            label: 'Active Devices',
            value: stats.activeDevices.toLocaleString(),
            icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight uppercase">Admin Overview</h1>
                <p className="text-text-muted text-sm">System statistics and general metrics.</p>
            </header>

            {/* Метрики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((stat, i) => (
                    <div key={i} className="bg-[#131316] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-[#00FF66]/20 transition-colors">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00FF66] opacity-[0.02] group-hover:opacity-[0.05] rounded-full blur-2xl transition-all"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#00FF66]/10 transition-colors">
                                <svg className="w-5 h-5 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Останні реєстрації */}
            <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold uppercase tracking-widest text-text-muted text-xs">Recent Signups</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white/2 text-xs uppercase tracking-widest text-text-muted">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold text-right">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.recentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-text-muted">No users found.</td>
                                </tr>
                            ) : (
                                stats.recentUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white">{user.name || 'Anonymous'}</p>
                                            <p className="text-xs text-text-muted">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/50'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-text-muted">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}