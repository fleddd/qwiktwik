import Link from 'next/link';
import FadeIn from './FadeIn';
import Slider from './Slider';
import { PAGES } from '@/constants/pages';

export default function Pricing() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden" id="pro">
            {/* Глобальне фонове світіння */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent blur-[200px] rounded-full opacity-[0.04] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <div className="text-center mb-10 md:mb-16">
                        <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                            Pricing Plans
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">
                            Choose your level of performance.
                        </h2>
                        <p className="text-text-muted text-sm md:text-lg max-w-2xl mx-auto px-2">
                            Start optimizing for free, or unlock the full potential of your hardware with our classified Elite tweaks.
                        </p>
                    </div>
                </FadeIn>

                {/* Слайдер із вирівнюванням по висоті */}
                <Slider desktopGridClasses="md:grid-cols-2">

                    {/* КАРТКА FREE */}
                    <FadeIn delay={0.1} className="h-full flex">
                        <div className="group bg-[#131316] border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col h-full w-full hover:border-white/20 transition-all duration-500 hover:shadow-2xl md:hover:-translate-y-1 relative overflow-hidden">
                            {/* Легкий блік при наведенні */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="mb-6 md:mb-8 relative z-10">
                                <h3 className="text-lg md:text-2xl font-bold mb-1 text-white">Free Starter</h3>
                                <p className="text-xs text-text-muted mb-3">Essential latency reduction.</p>
                                <div className="text-4xl md:text-5xl font-black flex items-baseline gap-1 text-white">
                                    $0<span className="text-xs md:text-sm text-text-muted font-bold">/forever</span>
                                </div>
                            </div>

                            <ul className="flex-1 space-y-3 md:space-y-4 mb-6 md:mb-8 relative z-10">
                                {['Basic OS Tweaks', 'Manual Mode Switching', 'Standard Support', 'Basic Telemetry Blocking'].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-text-muted font-medium">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white/30 stroke-[3] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link href={PAGES.DOWNLOAD_FREE} className="w-full text-center px-6 py-3.5 md:py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all text-sm md:text-base relative z-10">
                                Download Free
                            </Link>
                        </div>
                    </FadeIn>

                    {/* КАРТКА PRO ELITE */}
                    <FadeIn delay={0.2} className="h-full flex">
                        {/* Видалено mt-4, щоб картки були ідеально рівними */}
                        <div className="group bg-[#0a0a0c] border border-accent/30 shadow-[0_0_30px_rgba(0,255,102,0.08)] rounded-3xl p-5 md:p-8 flex flex-col h-full w-full relative transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,102,0.15)] hover:border-accent/60 md:hover:-translate-y-1 overflow-hidden">

                            {/* Анімований градієнт зверху */}

                            {/* Фоновий світильник для Pro картки */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent blur-[70px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="absolute top-3 right-5 md:right-8 bg-accent text-black text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-glow z-20">
                                Most Popular
                            </div>

                            <div className="mb-6 md:mb-8 relative z-10">
                                <h3 className="text-lg md:text-2xl font-bold mb-1 text-accent flex items-center gap-2">
                                    Pro Elite
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-accent"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                </h3>

                                <p className="text-xs text-text-muted mb-3">
                                    Absolute hardware dominance.
                                    <span className='text-xs'>Starting from: </span>
                                </p>
                                <div className="text-4xl md:text-5xl font-black flex items-baseline gap-1 text-white">
                                    $4.99<span className="text-xs md:text-sm text-text-muted font-bold">/mo</span>
                                </div>
                            </div>

                            <ul className="flex-1 space-y-3 md:space-y-4 mb-6 md:mb-8 relative z-10">
                                {['Advanced Network Tuning', 'Auto-Switching on launch', 'Priority Discord Support', 'Extreme Low-Latency Tweaks', 'Kernel-level Priorities'].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-white font-medium">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-accent stroke-[3] shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link href={PAGES.PRICING_PRO} className="w-full text-center px-6 py-3.5 md:py-4 bg-accent text-black font-black rounded-xl shadow-[0_4px_20px_rgba(0,255,102,0.2)] hover:bg-[#00d957] transition-all text-sm md:text-base relative z-10 active:scale-[0.98]">
                                Upgrade to Pro
                            </Link>
                        </div>
                    </FadeIn>

                </Slider>
            </div>
        </section>
    );
}