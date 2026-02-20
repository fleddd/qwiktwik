'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export default function FreePricing() {
    const freeTweaks = [
        { title: "Basic OS Debloat", desc: "Removes common preinstalled Windows apps and basic telemetry." },
        { title: "Manual Mode Switching", desc: "Switch between Balanced and Game modes manually via UI." },
        { title: "Standard Network Fix", desc: "Basic TCP/IP adjustments for more stable connection." },
        { title: "Disk Cleanup", desc: "Removes temporary files and system junk to free up space." },
        { title: "Standard Support", desc: "Access to our community Discord for general help." }
    ];

    return (
        <>
            <div className="min-h-screen pt-32 pb-20 bg-[#050505] text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Free Starter</h1>
                            <p className="text-text-muted text-lg max-w-2xl mx-auto">
                                Essential optimizations for every gamer. Get a cleaner system without spending a cent.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 gap-4 mb-16">
                        {freeTweaks.map((tweak, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-white/40 stroke-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{tweak.title}</h3>
                                        <p className="text-text-muted text-sm">{tweak.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.6}>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                            <h2 className="text-2xl font-bold mb-4">Start your journey today</h2>
                            <p className="text-text-muted mb-8 text-sm">No credit card required. Just download and run.</p>
                            <Link href="#" className="inline-block px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-white/90 transition-all shadow-xl">
                                Download Free Version
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </>
    );
}