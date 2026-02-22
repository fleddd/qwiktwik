'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PAGES } from '@/constants/pages';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Додаємо інтерфейс для пропсів
interface NavbarProps {
    user?: {
        name: string | null;
        avatar: string | null;
        email: string;
    } | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const closeProfile = () => setIsProfileOpen(false);
        if (isProfileOpen) window.addEventListener('click', closeProfile);
        return () => window.removeEventListener('click', closeProfile);
    }, [isProfileOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const navLinks = [
        { label: 'Download', href: PAGES.SIGNUP },
        { label: 'Reviews', href: PAGES.REVIEWS },
        { label: 'Pro', href: PAGES.PRICING_PRO, highlight: true },
        { label: 'How It Works', href: PAGES.DOCS },
    ];

    const handleMobileClick = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
    };
    const handleLogout = () => {
        Cookies.remove('accessToken', { path: '/' });
        router.refresh();
    };

    return (
        <>
            <nav className="fixed top-0 w-full py-4 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 z-[2000]">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link
                        href={PAGES.HOME}
                        className="text-2xl font-black flex items-center gap-2 tracking-tight z-[2100]"
                        onClick={handleMobileClick}
                    >
                        <svg viewBox="0 0 24 24" className="fill-[#00FF66] w-5 h-5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        QwikTwik
                    </Link>

                    <ul className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className={`text-md font-bold transition-colors cursor-pointer block ${link.highlight ? 'text-[#00FF66] hover:text-[#00d957]' : 'text-[#94a3b8] hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* DESKTOP АВТОРИЗАЦІЯ АБО ПРОФІЛЬ */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded-full transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shadow-lg shadow-black/50">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center text-sm font-black">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <motion.svg
                                        animate={{ rotate: isProfileOpen ? 180 : 0 }}
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors"
                                        fill="none" stroke="currentColor" strokeWidth="2.5"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-3 w-64 bg-[#0a0a0c] border border-white/5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[3000]"
                                        >
                                            {/* Header: Name & Email */}
                                            <div className="px-6 py-5 border-b border-white/5">
                                                <p className="text-white font-bold text-base truncate">{user.name || 'User'}</p>
                                                <p className="text-[#94a3b8] text-xs truncate mt-0.5">{user.email}</p>
                                            </div>

                                            {/* Links */}
                                            <div className="p-2 flex flex-col">
                                                <Link
                                                    href="/dashboard"
                                                    className="px-4 py-3 text-sm font-bold text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
                                                >
                                                    Account
                                                </Link>
                                                <Link
                                                    href="/dashboard/billing"
                                                    className="px-4 py-3 text-sm font-bold text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
                                                >
                                                    Billing
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-400/5 rounded-xl transition-colors flex items-center gap-3 cursor-pointer mt-1"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={PAGES.LOGIN}
                                    className="text-white hover:text-[#00FF66] font-bold text-sm transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={`${PAGES.PRICING_PRO}`}
                                    className="px-5 py-2.5 bg-[#00FF66] text-black font-black rounded-lg shadow-[0_4px_20px_rgba(0,255,102,0.2)] hover:bg-[#00d957] transition-all text-sm"
                                >
                                    Buy Now
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden z-[2100] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 8, backgroundColor: "#00FF66" } : { rotate: 0, y: 0, backgroundColor: "#ffffff" }}
                            className="w-6 h-0.5 rounded-full"
                        />
                        <motion.span
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-6 h-0.5 bg-white rounded-full"
                        />
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -8, backgroundColor: "#00FF66" } : { rotate: 0, y: 0, backgroundColor: "#ffffff" }}
                            className="w-6 h-0.5 rounded-full"
                        />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-[#050505] z-[1900] flex flex-col pt-32 pb-12 px-8 md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            <ul className="flex flex-col gap-6 mb-auto">
                                {navLinks.map((link, i) => (
                                    <motion.li
                                        key={link.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={handleMobileClick}
                                            className={`text-4xl font-black text-left w-full cursor-pointer block ${link.highlight ? 'text-[#00FF66]' : 'text-white'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* MOBILE АВТОРИЗАЦІЯ АБО ПРОФІЛЬ */}
                            <div className="flex flex-col gap-4 mt-8">
                                {user ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={handleMobileClick}
                                        className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl transition-all"
                                    >
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#00FF66]/20 text-[#00FF66] flex items-center justify-center text-sm font-bold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        )}
                                        <span className="text-white font-bold text-xl">Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={PAGES.LOGIN}
                                            onClick={handleMobileClick}
                                            className="w-full py-4 text-white font-bold text-center text-xl bg-white/5 border border-white/10 rounded-2xl"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href={`${PAGES.PRICING_PRO}`}
                                            onClick={handleMobileClick}
                                            className="w-full py-4 bg-[#00FF66] text-black font-black rounded-2xl text-center text-xl shadow-[0_0_20px_rgba(0,255,102,0.3)] active:scale-95 transition-transform block"
                                        >
                                            View Pro Plans
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}