import { AuthService } from '@/services/auth.service';
import Link from 'next/link';

export default async function OverviewPage() {
    const response = await AuthService.getProfile();
    const user = response.success ? response.data : undefined;

    const plan = user?.subscription?.plan || 'FREE';
    const isPro = plan === 'PRO';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-1 tracking-tight">System Overview</h1>
                    <p className="text-text-muted text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        Active Session
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${isPro ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-white'
                        }`}>
                        {plan} Plan
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Getting Started Card */}
                <div className="bg-[#131316] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">How to start optimizing?</h3>
                        <ol className="text-text-muted text-sm space-y-3 mb-6 list-decimal list-inside">
                            <li>Download the QwikTwik Desktop Client.</li>
                            <li>Run as Administrator on your PC.</li>
                            <li>Login using your account credentials.</li>
                            <li>Let the system bind your HWID automatically.</li>
                        </ol>
                    </div>
                    <Link href="/dashboard/downloads" className="inline-block text-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10">
                        Go to Downloads
                    </Link>
                </div>

                {/* Plan Upgrade Card */}
                {!isPro && (
                    <div className="bg-accent/5 border border-accent/20 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] opacity-20 text-accent">LIMITED ACCESS</div>
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2">Upgrade to PRO</h3>
                            <p className="text-text-muted text-sm mb-6">
                                Unlock hardware-level optimizations, advanced GPU tweaks, and prioritize your network traffic.
                            </p>
                            <ul className="text-sm space-y-2 mb-8">
                                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Access to all 75+ Tweaks</li>
                                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Up to 3 Linked Devices</li>
                                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Priority Support</li>
                            </ul>
                        </div>
                        <Link href="/dashboard/billing" className="text-center px-6 py-4 bg-accent text-black font-black rounded-xl shadow-glow hover:bg-accent-hover transition-all">
                            View Pricing
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}