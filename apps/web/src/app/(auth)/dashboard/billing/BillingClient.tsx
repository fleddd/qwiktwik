'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BillingService } from '@/services/billing.service';

// ВИДАЛЕНО: import { Plan } from '@repo/database';

interface BillingClientProps {
    // Використовуємо звичайні типи замість Enum
    currentPlan: 'PRO' | 'FREE' | string; 
    expiryDate: Date | string | null;
}

type Step = 'plan' | 'provider' | 'checkout';

export default function BillingClient({ currentPlan, expiryDate }: BillingClientProps) {
    const router = useRouter();

    const [step, setStep] = useState<Step>('plan');
    const [isExtending, setIsExtending] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedProvider, setSelectedProvider] = useState<'crypto' | 'paypal' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pricingPlans = [
        {
            id: 'MONTHLY',
            name: "Monthly",
            price: "$9.99",
            period: "/month",
            description: "Billed monthly",
            features: ["1000+ optimizations", "QwikTwik Game Mode", "Network Adapter Tuner"],
            highlight: false,
        },
        {
            id: 'YEARLY',
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
            id: 'LIFETIME',
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
        if (provider === 'paypal') {
            alert('PayPal integration is currently under development. Please use Cryptocurrency.');
            return;
        }
        setSelectedProvider(provider);
        setStep('checkout');
    };

    useEffect(() => {
        if (step === 'checkout' && selectedProvider === 'crypto' && selectedPlan) {
            startPayment();
        }
    }, [step]);

    const startPayment = async () => {
        setIsLoading(true);
        setError(null);

        const res = await BillingService.createCheckout(selectedPlan.id);

        if (res.success && res.data?.url) {
            window.location.href = res.data.url;
        } else {
            setError(!res.success ? res.error.message : 'Failed to initialize payment gateway.');
            setIsLoading(false);
        }
    };

    const showCurrentSub = currentPlan !== 'FREE' && !isExtending;

    // Форматування дати для красивого виводу
    const formattedExpiryDate = expiryDate
        ? new Date(expiryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header & Stepper */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
                        {showCurrentSub ? 'Your Subscription' : 'Upgrade your Experience'}
                    </h1>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
                        {showCurrentSub ? (
                            <span className="text-accent">Active Plan: {currentPlan}</span>
                        ) : (
                            <>
                                <motion.span animate={{ color: step === 'plan' ? '#00FF66' : '#94a3b8' }}>01 Select Plan</motion.span>
                                <span className="text-white/10">/</span>
                                <motion.span animate={{ color: step === 'provider' ? '#00FF66' : '#94a3b8' }}>02 Payment Method</motion.span>
                                <span className="text-white/10">/</span>
                                <motion.span animate={{ color: step === 'checkout' ? '#00FF66' : '#94a3b8' }}>03 Checkout</motion.span>
                            </>
                        )}
                    </div>
                </div>

                {(step !== 'plan' || isExtending) && !isLoading && (
                    <button
                        onClick={() => {
                            if (step === 'plan') setIsExtending(false);
                            else setStep(step === 'checkout' ? 'provider' : 'plan');
                        }}
                        className="text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none"
                    >
                        ← Back
                    </button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {/* VIEW: CURRENT SUBSCRIPTION INFO */}
                {showCurrentSub ? (
                    <motion.div
                        key="current-sub"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        <div className="bg-[#131316] border border-accent/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-8xl font-black uppercase tracking-tighter">{currentPlan}</span>
                            </div>

                            <div className="relative z-10">
                                <div className="inline-block bg-accent/10 text-accent text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4">
                                    Currently Active
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 uppercase italic">{currentPlan} PRO</h2>
                                <p className="text-text-muted text-sm mb-8">
                                    Your system is currently optimized with the full power of QwikTwik.
                                    {formattedExpiryDate && (
                                        <span className="block mt-2 font-bold text-white/90">
                                            Expires on: {formattedExpiryDate}
                                        </span>
                                    )}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setIsExtending(true)}
                                        className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-accent transition-all cursor-pointer text-xs uppercase"
                                    >
                                        Extend or Change Plan
                                    </button>
                                    <button
                                        onClick={() => router.push('/dashboard/transactions')}
                                        className="px-8 py-4 bg-white/5 text-white border border-white/5 font-black rounded-xl hover:bg-white/10 transition-all cursor-pointer text-xs uppercase"
                                    >
                                        View Invoices
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
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
                                            {currentPlan !== 'FREE' ? 'Extend Plan' : 'Choose Plan'}
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
                                <div
                                    onClick={() => handleSelectProvider('crypto')}
                                    className="bg-gradient-to-br from-[#1a1a24] to-[#0a0a0c] border border-indigo-500/10 p-6 rounded-[2rem] cursor-pointer hover:border-indigo-500/40 transition-all group relative overflow-hidden"
                                >
                                    <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-3 inline-block">Secure & Private</span>
                                    <h3 className="text-xl font-black text-white mb-1">Cryptocurrency</h3>
                                    <p className="text-text-muted text-xs mb-6">Pay with USDT (TRC-20), BTC, or ETH.</p>
                                    <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-all">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[12px] font-bold">₮</div>
                                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-[12px] font-bold">₿</div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => handleSelectProvider('paypal')}
                                    className="bg-gradient-to-br from-[#131316] to-[#0a0a0c] border border-blue-500/10 p-6 rounded-[2rem] opacity-50 grayscale relative overflow-hidden cursor-not-allowed"
                                >
                                    <span className="bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-3 inline-block">Coming Soon</span>
                                    <h3 className="text-xl font-black text-white mb-1">PayPal & Cards</h3>
                                    <p className="text-text-muted text-xs mb-6">Credit Cards and Balance.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CHECKOUT */}
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
                                        <h2 className="text-2xl font-black text-white">{selectedPlan?.name} {currentPlan !== 'FREE' ? 'Extension' : 'License'}</h2>
                                        <p className="text-accent font-black text-xl">{selectedPlan?.price}</p>
                                    </div>

                                    <div className="py-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center mb-6">
                                        {isLoading ? (
                                            <>
                                                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <h3 className="text-sm font-bold mb-1 italic text-white">Connecting to Gateway...</h3>
                                                <p className="text-[10px] text-text-muted px-10 text-center">Preparing your crypto invoice. Do not close this tab.</p>
                                            </>
                                        ) : error ? (
                                            <>
                                                <div className="text-red-500 text-2xl mb-2 font-bold">!</div>
                                                <h3 className="text-sm font-bold text-red-400 mb-1 text-center">Payment Failed</h3>
                                                <p className="text-[10px] text-text-muted px-10 text-center">{error}</p>
                                                <button onClick={startPayment} className="mt-4 text-[10px] text-accent font-bold uppercase underline cursor-pointer">Try Again</button>
                                            </>
                                        ) : (
                                            <h3 className="text-sm font-bold text-white italic">Redirecting...</h3>
                                        )}
                                    </div>

                                    <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">
                                        Hardware Bound License (HWID)
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
