import Link from 'next/link';
import FadeIn from './FadeIn';
import { PAGES } from '@/constants/pages';

export default function Pricing() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden" id="pro">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent blur-[200px] rounded-full opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">Choose your level of performance.</h2>
                        <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto px-2">
                            Start optimizing for free, or unlock the full potential of your hardware with our classified Elite tweaks.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    <FadeIn delay={0.1}>
                        <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 md:p-10 flex flex-col h-full hover:border-white/15 transition-all duration-300">
                            <div className="mb-8 md:mb-10">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Free Starter</h3>
                                <div className="text-4xl md:text-5xl font-black flex items-baseline gap-1 text-white">
                                    $0<span className="text-sm md:text-base text-text-muted font-bold">/forever</span>
                                </div>
                            </div>
                            <ul className="flex-1 space-y-4 md:space-y-5 mb-8 md:mb-10">
                                {['Basic OS Tweaks', 'Manual Mode Switching', 'Standard Support', 'Basic Telemetry Blocking'].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-text-muted font-medium">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6 stroke-white/40 stroke-[3] shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Link href={PAGES.PRICING_FREE} className="w-full text-center px-6 py-3.5 md:py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all text-sm md:text-base">
                                Download Free
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="bg-[#0a0a0c] border border-accent/40 shadow-[0_0_30px_rgba(0,255,102,0.1)] rounded-3xl p-6 md:p-10 flex flex-col h-full relative hover:shadow-[0_0_50px_rgba(0,255,102,0.15)] transition-all duration-300 transform md:-translate-y-2 mt-4 md:mt-0">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                            <div className="absolute -top-3 md:-top-4 right-6 md:right-8 bg-accent text-black text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                            <div className="mb-8 md:mb-10">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 text-accent">Pro Elite</h3>
                                <div className="text-4xl md:text-5xl font-black flex items-baseline gap-1 text-white">
                                    $9.99<span className="text-sm md:text-base text-text-muted font-bold">/mo</span>
                                </div>
                            </div>
                            <ul className="flex-1 space-y-4 md:space-y-5 mb-8 md:mb-10">
                                {['Advanced Network Tuning', 'Auto-Switching on game launch', 'Priority Discord Support', 'Extreme Low-Latency Tweaks', 'Kernel-level Prioritization'].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-white font-medium">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 md:w-6 md:h-6 stroke-accent stroke-[3] shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Link href={PAGES.PRICING_PRO} className="w-full text-center px-6 py-3.5 md:py-4 bg-accent text-black font-black rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(0,255,102,0.5)] transition-all text-sm md:text-base transform hover:-translate-y-1">
                                Upgrade to Pro
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}