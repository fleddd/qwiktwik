'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import FadeIn from '@/components/FadeIn';
import { PAGES } from "@/constants/pages";
import { AuthService } from '@/services/auth.service';
import type { RegisterInput } from '@repo/validation';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

export default function SignUp() {
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGlobalError(null);
        setFieldErrors({});
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as unknown as RegisterInput;

        try {
            const response = await AuthService.register(data);

            if (!response.success) {
                if (response.error.status === 400 && response.error.details) {
                    setFieldErrors(response.error.details);
                } else {
                    setGlobalError(response.error.message);
                }
                return;
            }

            Cookies.set('accessToken', response.data.accessToken, { expires: 7, path: '/' });
            router.push('/dashboard');
            router.refresh();

        } catch (err: any) {
            setGlobalError('Couldn\'t create an account. Please cheack out your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = (provider: 'google' | 'discord') => {
        const url = provider === 'google'
            ? AuthService.getGoogleAuthUrl()
            : AuthService.getDiscordAuthUrl();
        window.location.href = url;
    };

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
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Create Account</h1>
                        <p className="text-sm text-text-muted">Register to access Elite optimization profiles.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-[#131316] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

                        {globalError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-mono text-center">
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Username</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="GhostPlayer"
                                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'
                                        }`}
                                />
                                {fieldErrors.name && (
                                    <span className="text-red-400 text-[10px] md:text-xs font-mono">{fieldErrors.name[0]}</span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="ghost@example.com"
                                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'
                                        }`}
                                />
                                {fieldErrors.email && (
                                    <span className="text-red-400 text-[10px] md:text-xs font-mono">{fieldErrors.email[0]}</span>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm tracking-widest ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'
                                        }`}
                                />
                                {fieldErrors.password && (
                                    <span className="text-red-400 text-[10px] md:text-xs font-mono">{fieldErrors.password[0]}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer w-full py-3.5 bg-accent text-black font-black rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.2)] hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {isLoading ? 'Processing...' : 'Create an account'}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-white/5">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider text-center mb-4">Or register with</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleOAuthLogin('discord')} type="button" className="cursor-pointer flex items-center justify-center gap-2 py-2.5 bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 border border-[#5865F2]/20 rounded-xl transition-all text-sm font-bold">
                                    <FaDiscord className="text-lg" /> Discord
                                </button>
                                <button onClick={() => handleOAuthLogin('google')} type="button" className="cursor-pointer flex items-center justify-center gap-2 py-2.5 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-bold">
                                    <FaGoogle className="text-lg" /> Google
                                </button>
                            </div>
                        </div>

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