import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';
import { DevicesService } from '@/services/devices.service';
import { ReleasesService } from '@/services/releases.service';

export default async function OverviewPage() {
    const userRes = await AuthService.getProfile();
    const devicesRes = await DevicesService.getDevices();
    const releaseRes = await ReleasesService.getLatest();

    if (!userRes.success || !userRes.data) {
        redirect('/login');
    }

    const devices = devicesRes.success ? devicesRes.data : [];
    const release = releaseRes.success ? releaseRes.data : undefined;

    const user = userRes.data;
    const subscription = user.subscription;

    const plan = subscription?.plan || 'FREE';
    const isPro = plan === 'PRO';
    const isActive = subscription?.status === 'ACTIVE';

    // Розумне форматування дати без використання `interval`
    let expiryText = 'Never (Lifetime)';
    if (subscription?.currentPeriodEnd) {
        const endDate = new Date(subscription.currentPeriodEnd);

        if (endDate.getFullYear() < 2099) {
            expiryText = endDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-5">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black mb-1 tracking-tight uppercase">System Overview</h1>
                    <p className="text-text-muted text-xs md:text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00FF66] rounded-full animate-pulse"></span>
                        Welcome back, {user.name || 'Player'}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ЛІВА КАРТКА: Getting Started або Devices Info */}
                <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Hardware License</h3>
                        <p className="text-text-muted text-xs mb-4 leading-relaxed">
                            QwikTwik binds securely to your PC's hardware (HWID) to prevent unauthorized sharing and ensure maximum performance.
                        </p>

                        {isPro ? (
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Linked Devices</span>
                                    <span className="text-sm font-black text-white">{devices.length} / 3</span>
                                </div>
                                {release && (
                                    <div className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-xl border border-white/5">
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Client Version</span>
                                        <span className="text-sm font-black text-[#00FF66]">v{release.version}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <ol className="text-text-muted text-xs space-y-2 mb-4 list-decimal list-inside bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                                <li>Download the QwikTwik Desktop Client.</li>
                                <li>Run as Administrator on your PC.</li>
                                <li>Login using your credentials.</li>
                            </ol>
                        )}
                    </div>
                    <Link href="/dashboard/downloads" className="text-center px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 relative z-10 text-sm">
                        {isPro ? 'Download Latest Client' : 'Get Started'}
                    </Link>
                </div>

                {/* ПРАВА КАРТКА: Підписка (PRO) або Реклама (FREE) */}
                {isPro && isActive ? (
                    <div className="bg-gradient-to-br from-[#1a1a24] to-[#0a0a0c] border border-indigo-500/20 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Active License</span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">PRO PLAN</h3>
                            <p className="text-indigo-200/60 text-xs mb-6 font-medium">Your system is fully unlocked.</p>

                            <div className="space-y-3 mb-6">
                                <div>
                                    <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold mb-0.5">Valid Until</p>
                                    <p className="text-base font-bold text-white">{expiryText}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold mb-0.5">Features</p>
                                    <p className="text-xs font-medium text-white/80 leading-relaxed">Kernel-level Priorities, Zero-Trace Debloat, Advanced Network Tuning.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard/billing" className="text-center px-5 py-3 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] relative z-10 text-sm">
                            Manage Subscription
                        </Link>
                    </div>
                ) : (
                    <div className="bg-[#00FF66]/5 border border-[#00FF66]/20 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] opacity-20 text-[#00FF66]">LIMITED ACCESS</div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white mb-2">Upgrade to PRO</h3>
                            <p className="text-text-muted text-xs mb-4 leading-relaxed">
                                Unlock hardware-level optimizations, advanced GPU tweaks, and prioritize your network traffic.
                            </p>
                            <ul className="text-xs space-y-2 mb-6 bg-black/20 p-3 rounded-xl border border-white/5">
                                <li className="flex items-center gap-2"><span className="text-[#00FF66] font-black">✓</span> Access to all 75+ Tweaks</li>
                                <li className="flex items-center gap-2"><span className="text-[#00FF66] font-black">✓</span> Up to 3 Linked Devices</li>
                                <li className="flex items-center gap-2"><span className="text-[#00FF66] font-black">✓</span> Priority Support</li>
                            </ul>
                        </div>
                        <Link href="/dashboard/billing" className="text-center px-5 py-3 bg-[#00FF66] text-black font-black rounded-xl shadow-[0_4px_20px_rgba(0,255,102,0.2)] hover:bg-[#00d957] transition-all relative z-10 text-sm">
                            View Pricing
                        </Link>
                    </div>
                )}
            </div>

            {/* БЛОК ВІДГУКУ */}
            <div className="bg-[#131316] border border-white/5 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden mt-4">
                <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white mb-0.5">Share your experience</h4>
                        <p className="text-xs text-text-muted">Did QwikTwik boost your FPS? Leave a review and help the community grow.</p>
                    </div>
                </div>
                <Link href="/dashboard/reviews" className="shrink-0 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all whitespace-nowrap relative z-10 text-sm">
                    Write a Review
                </Link>
            </div>

        </div>
    );
}