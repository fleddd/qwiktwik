'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export default function ProPricing() {
    const eliteTweaks = [
        { title: "Kernel-Level Priorities", desc: "Direct injection into Windows Scheduler to prioritize game threads over everything else." },
        { title: "GPU P0 Power State", desc: "Forces your GPU into the highest performance state, preventing clock drops during combat." },
        { title: "MSI Interrupt Tuning", desc: "Optimizes Message Signaled Interrupts to bypass CPU bottlenecks and reduce input lag." },
        { title: "Deep SRUM & Telemetry Purge", desc: "Completely wipes System Resource Usage Monitor data and all 75+ tracking agents." },
        { title: "Auto-Launch Detection", desc: "QwikTwik detects when your game starts and applies the Elite profile instantly in the background." },
        { title: "Advanced Network Stack", desc: "Custom TCP/IP and QoS settings designed specifically for UDP (Game) traffic." }
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-20 bg-[#050505] text-white relative overflow-hidden">
                {/* Агресивний фон для Pro */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent blur-[200px] rounded-full opacity-[0.07] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold text-accent uppercase tracking-widest mb-6">
                                The Ultimate Advantage
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">Pro <span className="text-accent">Elite</span></h1>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
                                Our most advanced engine. We dug deep into the Windows kernel to remove stutters that other tools can&apos;t even find.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 gap-6 mb-16">
                        {eliteTweaks.map((tweak, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-[#131316] border border-accent/20 p-8 rounded-3xl flex items-start gap-6 hover:bg-accent/[0.02] transition-colors shadow-2xl group">
                                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 stroke-accent stroke-[2.5]"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-accent transition-colors">{tweak.title}</h3>
                                        <p className="text-text-muted leading-relaxed">{tweak.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.7}>
                        <div className=" border border-accent shadow-glow rounded-3xl p-10 md:p-14 text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready for zero-latency?</h2>
                            <div className="text-5xl font-black mb-8">$9.99<span className="text-xl opacity-60">/mo</span></div>
                            <Link href="#" className="inline-block px-12 py-5 bg-accent text-black font-black rounded-2xl hover:scale-105 transition-all shadow-2xl text-lg">
                                Unlock Pro Elite Now
                            </Link>
                            <p className="mt-6 text-sm font-bold opacity-60 uppercase tracking-widest">Instant Activation • Cancel Anytime</p>
                        </div>
                    </FadeIn>
                </div>
            </main>
            <Footer />
        </>
    );
}