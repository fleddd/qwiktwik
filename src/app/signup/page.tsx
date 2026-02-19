'use client';

import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function SignUp() {
    return (
        <main className="h-screen w-full flex items-center justify-center relative p-6 overflow-hidden bg-[#050505]">
            <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 text-text-muted hover:text-white flex items-center gap-2 transition-colors font-medium z-20 text-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5 stroke-current stroke-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back
            </Link>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent blur-[200px] rounded-full opacity-[0.05] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col justify-center">
                <FadeIn>
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-xl md:text-2xl font-black mb-4 md:mb-6 text-white hover:text-accent transition-colors">
                            <svg viewBox="0 0 24 24" className="fill-current w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            QwikTwik
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Create Account</h1>
                        <p className="text-sm text-text-muted">Register to access Elite optimization profiles.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

                        <form className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    placeholder="GhostPlayer"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="ghost@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-mono text-sm tracking-widest"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-accent text-black font-black rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all transform hover:-translate-y-0.5 mt-2"
                            >
                                Generate Credentials
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-white/5 text-center">
                            <p className="text-xs md:text-sm text-text-muted">
                                Already optimized?{' '}
                                <Link href="/login" className="text-white font-bold hover:text-accent transition-colors">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}