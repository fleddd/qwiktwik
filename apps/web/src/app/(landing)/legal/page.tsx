'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/FadeIn';

export default function Legal() {
    const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>('tos');

    return (
        <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Legal Information</h1>
                        <p className="text-text-muted text-sm md:text-base">Last updated: March 2024</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="flex justify-center mb-8 md:mb-12">
                        <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('tos')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'tos' ? 'bg-[#131316] text-white shadow-md' : 'text-text-muted hover:text-white'}`}
                            >
                                Terms of Service
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-[#131316] text-white shadow-md' : 'text-text-muted hover:text-white'}`}
                            >
                                Privacy Policy
                            </button>
                        </div>
                    </div>
                </FadeIn>

                <div className="bg-[#131316] border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {activeTab === 'tos' && (
                            <motion.div key="tos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="prose prose-invert prose-sm md:prose-base max-w-none text-text-muted">
                                <h2 className="text-white text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="mb-6">By downloading, installing, or using QwikTwik, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the software.</p>

                                <h2 className="text-white text-xl font-bold mb-4">2. Software Functionality and Risks</h2>
                                <p className="mb-6">QwikTwik interacts directly with the Windows Registry, Kernel states, and hardware allocation. While we test our profiles extensively, modifying system parameters carries inherent risks. You acknowledge that QwikTwik is provided "as is" and we are not liable for system instability, data loss, or hardware malfunction.</p>

                                <h2 className="text-white text-xl font-bold mb-4">3. Pro Subscription</h2>
                                <p className="mb-6">Certain features require a paid "Pro" subscription. Payments are processed securely via third-party providers. Subscriptions auto-renew unless canceled prior to the billing cycle.</p>
                            </motion.div>
                        )}

                        {activeTab === 'privacy' && (
                            <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="prose prose-invert prose-sm md:prose-base max-w-none text-text-muted">
                                <h2 className="text-white text-xl font-bold mb-4">1. Zero-Trace Philosophy</h2>
                                <p className="mb-6">We build software to stop tracking, not to add to it. QwikTwik does not collect, harvest, or transmit your personal data, browsing history, or system files to our servers.</p>

                                <h2 className="text-white text-xl font-bold mb-4">2. Telemetry and Diagnostics</h2>
                                <p className="mb-6">The QwikTwik client runs locally. We only collect anonymized crash reports if you explicitly opt-in during installation. This data is strictly used to improve engine stability.</p>

                                <h2 className="text-white text-xl font-bold mb-4">3. Payment Information</h2>
                                <p className="mb-6">When you upgrade to Pro, your payment details are handled securely by our payment processor (e.g., Stripe). We do not store or have direct access to your credit card information.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}