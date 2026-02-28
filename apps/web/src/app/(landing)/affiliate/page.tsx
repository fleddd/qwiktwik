'use client';

import { motion } from 'framer-motion';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export default function Affiliate() {
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdkTyuyako2N0mKgnWjGzpz_gIuhe07nO72gddcjzW-yFoPuQ/viewform?usp=publish-editor";

    return (
        <div className="min-h-screen pt-28 md:pt-36 pb-24  text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Hero Section */}
                <FadeIn>
                    <div className="text-center mb-16 md:mb-24">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            <span className='text-accent'>
                                Share QwikTwik. <br className="hidden md:block" />
                            </span>
                            <span className="text-white">
                                Earn Real Cash.
                            </span>
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Join our affiliate squad and unlock generous commissions per subscription. Share your link, help other gamers optimize their setups, and watch your earnings level up.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl bg-accent text-black text-sm md:text-base font-bold hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                Apply via Google Forms
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                {/* Steps Section */}
                <FadeIn delay={0.1}>
                    <div className="mb-20">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
                            <p className="text-text-muted">Start your quest as an affiliate in three simple steps.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: '01', title: 'Submit Application', desc: 'Fill out our quick Google Form to join the program.' },
                                { step: '02', title: 'Get Your Link', desc: 'Once approved, receive your unique tracking link and media kit.' },
                                { step: '03', title: 'Earn Commission', desc: 'Share with your audience and get paid for every successful referral.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-charcoal border border-white/5 rounded-3xl p-8 flex flex-col items-start hover:border-white/10 transition-colors">
                                    <span className="text-white/20 font-mono text-xl font-bold mb-4">{item.step}</span>
                                    <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Benefits / Info Section */}
                <FadeIn delay={0.2}>
                    <div className="bg-charcoal border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Why partner with us?</h2>
                                <p className="text-text-muted mb-8 leading-relaxed">
                                    We build software that actually makes a difference. By promoting QwikTwik, you're offering your community a top-tier PC optimization tool while earning a fair share of the revenue.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Competitive commission rates',
                                        'Exclusive marketing assets & media kits',
                                        'Fast payouts via Crypto',
                                        'Direct support from our team'
                                    ].map((benefit, i) => (
                                        <li key={i} className="flex items-center text-sm md:text-base text-gray-300">
                                            <svg className="w-5 h-5 mr-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-8 text-center flex flex-col justify-center items-center h-full">
                                <h3 className="text-xl font-bold mb-4">Ready to start?</h3>
                                <p className="text-text-muted text-sm mb-6">Fill out the form and we'll get back to you within 24-48 hours.</p>
                                <a
                                    href={GOOGLE_FORM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-charcoal border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-all w-full"
                                >
                                    Open Form
                                </a>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* FAQ Section */}
                <FadeIn delay={0.3}>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: "How do I get paid?", a: "We process payments monthly via Crypto once you reach the minimum payout threshold of $20." },
                                { q: "Who can become an affiliate?", a: "Content creators, bloggers, and tech enthusiasts with an engaged audience are welcome to apply. We review each application manually." },
                                { q: "How do you track sales?", a: "After approval, you'll get special status on your account to create own referral code to generate sign up link. We use this link to track clicks and attribute successful subscriptions to your account." }
                            ].map((faq, i) => (
                                <details key={i} className="group bg-charcoal border border-white/5 rounded-2xl">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-white">
                                        <span>{faq.q}</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-text-muted px-6 pb-6 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    );
}