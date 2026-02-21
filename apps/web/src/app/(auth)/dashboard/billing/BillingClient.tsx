'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/FadeIn';
import { PAGES } from '@/constants/pages';

interface BillingClientProps {
    currentPlan: string;
}

type Step = 'plan' | 'provider' | 'checkout';

export default function BillingClient({ currentPlan }: BillingClientProps) {
    const [step, setStep] = useState<Step>('plan');
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedProvider, setSelectedProvider] = useState<'crypto' | 'paypal' | null>(null);

    const pricingPlans = [
        {
            id: 'monthly',
            name: "Monthly",
            price: "$9.99",
            period: "/month",
            description: "Billed monthly",
            features: ["1000+ optimizations", "QwikTwik Game Mode", "Network Adapter Tuner"],
            highlight: false,
        },
        {
            id: 'yearly',
            name: "Yearly",
            price: "$4.99",
            period: "/month",
            oldPrice: "$9.99",
            save: "Save 50%",
            description: "Billed yearly ($59.88)",
            features: ["All Monthly features", "Advanced AI Optimizer", "Kernel Priority Access"],
            highlight: true,
        },
        {
            id: 'lifetime',
            name: "Lifetime",
            price: "$129",
            period: "one-time",
            description: "Pay once, own forever",
            features: ["All Yearly features", "Zero re-billing", "Lifetime License"],
            highlight: false,
        }
    ];

    const handleSelectPlan = (plan: any) => {
        setSelectedPlan(plan);
        setStep('provider');
    };

    const handleSelectProvider = (provider: 'crypto' | 'paypal') => {
        setSelectedProvider(provider);
        setStep('checkout');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header & Stepper */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Upgrade your Experience</h1>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                        <motion.span animate={{ color: step === 'plan' ? '#00FF66' : '#94a3b8' }}>01 Select Plan</motion.span>
                        <span className="text-white/10">/</span>
                        <motion.span animate={{ color: step === 'provider' ? '#00FF66' : '#94a3b8' }}>02 Payment Method</motion.span>
                        <span className="text-white/10">/</span>
                        <motion.span animate={{ color: step === 'checkout' ? '#00FF66' : '#94a3b8' }}>03 Checkout</motion.span>
                    </div>
                </div>

                {step !== 'plan' && (
                    <button
                        onClick={() => setStep(step === 'checkout' ? 'provider' : 'plan')}
                        className="text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none"
                    >
                        ← Back
                    </button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {/* STEP 1: PLAN SELECTION */}
                {step === 'plan' && (
                    <motion.div
                        key="step-plan"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {pricingPlans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => handleSelectPlan(plan)}
                                className={`relative flex flex-col p-6 rounded-[2rem] bg-[#131316] border transition-all cursor-pointer hover:scale-[1.01] group ${plan.highlight ? 'border-accent shadow-glow' : 'border-white/5 hover:border-white/20'}`}
                            >
                                {plan.save && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black font-black text-[9px] px-3 py-0.5 rounded-full uppercase">
                                        {plan.save}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold mb-4">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="text-text-muted text-xs font-bold">{plan.period}</span>
                                </div>
                                <p className="text-text-muted text-[11px] mb-6">{plan.description}</p>
                                <ul className="space-y-3 mb-8 grow">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                                            <span className="text-accent text-[10px]">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 rounded-xl text-xs font-black transition-all cursor-pointer bg-white/5 text-white group-hover:bg-accent group-hover:text-black border border-white/5">
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* STEP 2: PROVIDER SELECTION */}
                {step === 'provider' && (
                    <motion.div
                        key="step-provider"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
                    >
                        {/* Crypto */}
                        <div
                            onClick={() => handleSelectProvider('crypto')}
                            className="bg-gradient-to-br from-[#1a1a24] to-[#0a0a0c] border border-indigo-500/10 p-6 rounded-[2rem] cursor-pointer hover:border-indigo-500/40 transition-all group relative overflow-hidden"
                        >
                            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-3 inline-block">Secure & Private</span>
                            <h3 className="text-xl font-black text-white mb-1">Cryptocurrency</h3>
                            <p className="text-text-muted text-xs mb-6">Pay with USDT, BTC, ETH, or SOL.</p>
                            <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-all">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[12px] font-bold">₮</div>
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[12px] font-bold">₿</div>
                            </div>
                        </div>

                        {/* PayPal */}
                        <div
                            onClick={() => handleSelectProvider('paypal')}
                            className="bg-gradient-to-br from-[#131316] to-[#0a0a0c] border border-blue-500/10 p-6 rounded-[2rem] cursor-pointer hover:border-blue-500/40 transition-all group relative overflow-hidden"
                        >
                            <span className="bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-3 inline-block">Instant Access</span>
                            <h3 className="text-xl font-black text-white mb-1">PayPal & Cards</h3>
                            <p className="text-text-muted text-xs mb-6">Credit Cards, Debit Cards, or Balance.</p>
                            <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-all text-[8px] font-bold">
                                <div className="px-3 h-8 bg-white/5 rounded-lg flex items-center justify-center uppercase">PayPal</div>
                                <div className="px-3 h-8 bg-white/5 rounded-lg flex items-center justify-center uppercase">Visa</div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: COMPACT CHECKOUT */}
                {step === 'checkout' && (
                    <motion.div
                        key="step-checkout"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-[#131316] border border-white/5 p-8 rounded-[2.5rem] text-center">
                            <div className="mb-6 pb-6 border-b border-white/5">
                                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest mb-2">Order Summary</p>
                                <h2 className="text-2xl font-black text-white">{selectedPlan?.name} License</h2>
                                <p className="text-accent font-black text-xl">{selectedPlan?.price}</p>
                            </div>

                            <div className="py-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center mb-6">
                                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h3 className="text-sm font-bold mb-1 italic text-white">
                                    {selectedProvider === 'crypto' ? 'Waiting for Crypto Gateway...' : 'Redirecting to PayPal...'}
                                </h3>
                                <p className="text-[10px] text-text-muted px-10">
                                    Initializing secure connection. Do not close this tab.
                                </p>
                            </div>

                            <button
                                onClick={() => alert('Integration coming soon...')}
                                className="w-full py-4 bg-accent text-black font-black rounded-xl hover:bg-accent-hover shadow-glow transition-all cursor-pointer text-sm uppercase"
                            >
                                Confirm & Pay with {selectedProvider === 'crypto' ? 'Crypto' : 'PayPal'}
                            </button>

                            <p className="mt-4 text-[9px] text-text-muted uppercase tracking-widest font-bold">
                                Hardware Bound License (HWID)
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}