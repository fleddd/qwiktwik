import Link from 'next/link';
import FadeIn from './FadeIn';

export default function Hero() {
    return (
        <section className="relative pt-40 pb-24 text-center overflow-hidden">
            {/* Світіння (Glow Orb) */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent blur-[150px] rounded-full opacity-10 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                    <div className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-sm font-medium text-accent mb-6">
                        ⚡ Trusted by 100,000+ Gamers & Streamers
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Maximize FPS. Minimize Input Lag.<br />Zero Reboots.
                    </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
                        The ultimate PC boost utility for competitive gaming. QwikTwik optimizes your Windows registry, reduces ping, and unlocks maximum hardware performance in real-time.
                    </p>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link href="#" className="px-6 py-3 bg-accent text-black font-semibold rounded-lg shadow-glow hover:bg-accent-hover hover:shadow-glow-hover hover:-translate-y-0.5 transition-all duration-300">
                            Get QwikTwik for Free
                        </Link>
                        <Link href="#pro" className="px-6 py-3 bg-transparent text-text-main border border-white/10 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors duration-300">
                            View Pro Plans
                        </Link>
                    </div>
                </FadeIn>

                {/* Візуал (Mockup) */}
                <FadeIn delay={0.4}>
                    <div className="relative max-w-4xl mx-auto h-[450px] bg-gradient-to-br from-white/5 to-white/0 border border-white/5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,255,102,0.02)_10px,rgba(0,255,102,0.02)_20px)]"></div>

                        <div className="w-4/5 h-3/4 bg-bg-charcoal rounded-xl border border-white/5 p-5 shadow-[0_10px_30px_rgba(0,255,102,0.05)] flex flex-col relative z-10">
                            <div className="flex gap-2 mb-5">
                                <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
                                <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
                                <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(0,255,102,1)]"></div>
                            </div>
                            <div className="h-10 bg-white/5 rounded-md mb-3 w-full"></div>
                            <div className="flex gap-3 h-full">
                                <div className="flex-1 bg-accent/10 rounded-md border border-accent/30"></div>
                                <div className="flex-[2] bg-white/5 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}