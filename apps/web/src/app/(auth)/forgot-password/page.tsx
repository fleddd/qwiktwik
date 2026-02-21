'use client';

import { useState } from 'react';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { AuthService } from '@/services/auth.service';

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        try {
            await AuthService.forgotPassword({ email });
            setSent(true);
        } catch (err: any) {
            // З міркувань безпеки краще не показувати, що email не знайдено,
            // але для етапу розробки можемо вивести помилку
            setError(err.message || 'Failed to process request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="h-screen w-full flex items-center justify-center relative p-6 overflow-hidden bg-[#050505]">
            <Link href="/login" className="absolute top-6 left-6 md:top-8 md:left-8 text-text-muted hover:text-white flex items-center gap-2 transition-colors font-medium z-20 text-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 md:w-5 md:h-5 stroke-current stroke-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Return to Login
            </Link>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500 blur-[200px] rounded-full opacity-[0.03] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col justify-center">
                <FadeIn>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 stroke-white stroke-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">System Override</h1>
                        <p className="text-sm text-text-muted">Initiate password recovery protocol.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>

                        {error && !sent && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-mono text-center">
                                {error}
                            </div>
                        )}

                        {sent ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-2">
                                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Transmission Sent</h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    If a profile exists for that email, recovery instructions have been dispatched. Check your inbox.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="ghost@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all font-mono text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-accent text-black font-black rounded-xl hover:bg-accent/90 transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {isLoading ? 'Processing...' : 'Send Recovery Link'}
                                </button>
                            </form>
                        )}
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}