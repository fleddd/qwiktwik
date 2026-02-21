'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { PAGES } from '@/constants/pages';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function ProPricing() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const pricingPlans = [
        {
            name: "Monthly",
            price: "$9.99",
            period: "/month",
            description: "Billed monthly",
            features: ["1000+ optimizations", "QwikTwik Game Mode", "Network Adapter Tuner", "Priority Support"],
            highlight: false,
            cta: "Get Premium",
            href: PAGES.CHECKOUT_PRO
        },
        {
            name: "Yearly",
            price: "$4.99",
            period: "/month",
            oldPrice: "$9.99",
            save: "Save 50%",
            description: "Billed yearly ($59.88)",
            features: ["All Monthly features", "Advanced AI Optimizer", "Kernel Priority Access", "Early Beta Access"],
            highlight: true,
            cta: "Get Premium",
            href: PAGES.CHECKOUT_PRO
        },
        {
            name: "Lifetime",
            price: "$129",
            period: "one-time",
            description: "Pay once, own forever",
            features: ["All Yearly features", "Zero re-billing", "Lifetime License", "Exclusive Discord Badge"],
            highlight: false,
            cta: "Buy Once",
            href: PAGES.CHECKOUT_PRO
        }
    ];

    const comparisonGroups = [
        {
            category: "Core Engine Optimizations",
            features: [
                { name: "Dynamic Thread Priority Management", free: "Basic", pro: "Kernel-Level" }, // Ref: Optimize Priority
                { name: "Low-Level Kernel Micro-Tweaks", free: false, pro: true }, // Ref: Kernel Tweaks
                { name: "Precision Timer Serialization", free: false, pro: "Ultra" }, // Ref: Timer Resolution
                { name: "Interrupt Steering Architecture", free: false, pro: true }, // Ref: Interrupt Steering
                { name: "Win32 Priority Separation", free: "Standard", pro: "Optimized" }, // Ref: Resource Policy Sets
            ]
        },
        {
            category: "Hardware & Latency",
            features: [
                { name: "GPU Power State Lockdown (P0)", free: false, pro: true }, // Ref: Force P0 State
                { name: "Direct Message Signaled Interrupts (MSI)", free: false, pro: true }, // Ref: Optimize MSI
                { name: "CPU Core Parking Suppression", free: "Partial", pro: "Full" }, // Ref: Optimize CPU
                { name: "Bypass System Virtualization (VBS Override)", free: false, pro: true }, // Ref: Disable VBS
                { name: "Advanced BIOS Instruction Tuning", free: false, pro: "[CLASSIFIED]" }, // Ref: BIOS Optimizations
            ]
        },
        {
            category: "Network & Connectivity",
            features: [
                { name: "Zero-Latency UDP Stack", free: false, pro: true }, // Ref: Optimize Network
                { name: "Intelligent Packet Prioritization (QoS)", free: "Basic", pro: "Elite" }, // Ref: Optimize QoS
                { name: "Bufferbloat Reduction Presets", free: false, pro: true }, // Ref: Network Adapter Tuner
                { name: "TCP/IP Congestion Refinement", free: false, pro: true },
            ]
        },
        {
            category: "System Maintenance & Debloat",
            features: [
                { name: "Neural Telemetry Shield", free: true, pro: "Advanced" }, // Ref: Disable Telemetry
                { name: "SRUM Data Forensic Purge", free: false, pro: true }, // Ref: Clear SRUM Data
                { name: "Deep Background Service Minimization", free: "Standard", pro: "Aggressive" }, // Ref: Disable Useless Services
                { name: "Xbox & Game Bar Integration Clean", free: true, pro: true }, // Ref: Disable Xbox Apps
                { name: "Windows Update Auto-Freeze", free: false, pro: true }, // Ref: Disable Windows Updates
            ]
        }
    ];

    const faqs = [
        { q: "How do I receive premium after purchase?", a: "Simply log out and log back into the QwikTwik app. Your license will sync automatically with your hardware ID." },
        { q: "Can I cancel my subscription anytime?", a: "Yes, you can manage your subscription through your account dashboard or via our support team. No hidden fees." },
        { q: "Are tweaks locked to one PC?", a: "Yes, licenses are hardware-bound (HWID). However, we offer free system transfers if you buy a new PC." }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20  text-white overflow-hidden">
            {/* Hero section */}
            <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                <FadeIn>
                    <h1 className="font-display text-2xl md:text-4xl font-black uppercase mb-6 tracking-tighter">
                        Unlock Your PC's <span className="text-accent">Full Potential</span>
                    </h1>
                    <p className="text-text-muted text-md max-w-2xl mx-auto font-body">
                        Completely optimize your system for maximum FPS and ultra-low latency with Pro Elite.
                    </p>
                </FadeIn>
            </div>

            {/* Pricing Cards Grid */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                {pricingPlans.map((plan, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className={`relative flex flex-col p-8 rounded-[2.5rem] bg-charcoal border transition-all hover:scale-[1.02] ${plan.highlight ? 'border-accent shadow-glow' : 'border-white/5'}`}>
                            {plan.save && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-black font-black text-xs px-4 py-1 rounded-full uppercase">
                                    {plan.save}
                                </div>
                            )}
                            <h3 className="font-display text-2xl font-bold mb-6">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-text-muted font-bold">{plan.period}</span>
                            </div>
                            {plan.oldPrice && (
                                <span className="text-text-muted line-through text-sm mb-4 block">{plan.oldPrice} /month</span>
                            )}
                            <p className="text-text-muted text-sm mb-8">{plan.description}</p>

                            <ul className="space-y-4 mb-10 grow">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-accent shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`w-full py-4 rounded-2xl font-black text-center transition-all ${plan.highlight ? 'bg-accent text-black hover:bg-accent-hover' : 'bg-white/5 text-white hover:bg-white/10'}`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    </FadeIn>
                ))}
            </section>

            {/* Comparison Table */}
            <section className="max-w-5xl mx-auto px-4 md:px-6 mb-32">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Detailed Specifications</h2>
                        <p className="text-text-muted font-body text-sm md:text-base">Compare every low-level modification included in our engine.</p>
                    </div>

                    <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-[#0f0f11] shadow-2xl">
                        {/* Заголовок таблиці - приховуємо на мобайлі, бо він там не потрібен */}
                        <div className="hidden md:grid grid-cols-3 border-b border-white/10 bg-white/[0.02]">
                            <div className="p-8 text-text-muted font-bold uppercase text-xs tracking-widest text-left">Optimizations</div>
                            <div className="p-8 text-text-muted font-bold uppercase text-xs tracking-widest text-center">Standard</div>
                            <div className="p-8 text-accent font-bold uppercase text-xs tracking-widest text-center">Elite Edition</div>
                        </div>

                        {comparisonGroups.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col">
                                {/* Заголовок категорії */}
                                <div className="bg-accent/[0.03] px-6 md:px-8 py-4 text-accent font-display text-xs md:text-sm font-bold uppercase tracking-widest border-b border-white/5">
                                    {group.category}
                                </div>

                                {group.features.map((feat, fIdx) => (
                                    <div
                                        key={fIdx}
                                        className="flex flex-col md:grid md:grid-cols-3 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group p-6 md:p-0"
                                    >
                                        {/* Назва фічі */}
                                        <div className="md:p-6 md:pl-10 flex items-center gap-3 mb-4 md:mb-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
                                            <span className="font-bold md:font-medium text-sm md:text-base text-white">
                                                {feat.name}
                                            </span>
                                        </div>

                                        {/* Значення для Free (Standard) */}
                                        <div className="flex justify-between items-center md:justify-center md:p-6 text-sm border-t border-white/5 md:border-t-0 pt-3 ">
                                            <span className="md:hidden text-text-muted uppercase text-[10px] font-bold tracking-tighter">Standard</span>
                                            <span className="text-text-muted italic">
                                                {typeof feat.free === 'boolean' ? (feat.free ? 'Enabled' : '—') : feat.free}
                                            </span>
                                        </div>

                                        {/* Значення для Pro (Elite) */}
                                        <div className="flex justify-between items-center md:justify-center md:p-6 text-sm mt-2 md:mt-0">
                                            <span className="md:hidden text-accent uppercase text-[10px] font-bold tracking-tighter">Elite Edition</span>
                                            <span>
                                                {typeof feat.pro === 'boolean' ? (
                                                    feat.pro ? <span className="text-accent font-black drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">UNLOCKED</span> : '—'
                                                ) : (
                                                    <span className="text-white font-black">{feat.pro}</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto px-6 pb-20">
                <FadeIn>
                    <h2 className="font-display text-3xl font-black text-center mb-12 uppercase tracking-tight">Frequently Asked Questions</h2>
                    <div className="space-y-4 font-body">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/5 bg-[#0f0f11] rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                                >
                                    <span className="font-bold text-lg">{faq.q}</span>
                                    <motion.span
                                        animate={{ rotate: openFaq === i ? 45 : 0 }}
                                        className="text-accent text-2xl"
                                    >
                                        +
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-text-muted leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}