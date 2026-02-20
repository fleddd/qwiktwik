'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Додали хуки для навігації
import { motion, AnimatePresence } from 'framer-motion';
import { PAGES } from '@/constants/pages';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

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
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Розділяємо лінки на ті, що скролять (sectionId), і ті, що переходять на інші сторінки (href)
    const navLinks = [
        { label: 'Features', sectionId: 'features' },
        { label: 'Modes', sectionId: 'modes' },
        { label: 'Pro Version', sectionId: 'pro' },
        { label: 'Docs', href: PAGES.DOCS, highlight: true },
        { label: 'FAQ', sectionId: 'faq' },
    ];

    // Функція програмного скролу
    const handleNavigation = (link: { label: string, sectionId?: string, href?: string }) => {
        setIsOpen(false); // Закриваємо мобільне меню при кліку

        if (link.sectionId) {
            if (pathname === PAGES.HOME) {
                // Якщо ми ВЖЕ на головній сторінці - робимо плавний скрол
                const element = document.getElementById(link.sectionId);
                if (element) {
                    const navHeight = 80; // Приблизна висота нашого хедера, щоб заголовок не ховався під нього
                    const top = element.getBoundingClientRect().top + window.scrollY;

                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Якщо ми на сторінці Docs, а клікнули Features - кидаємо на головну з хешем
                router.push(`${PAGES.HOME}#${link.sectionId}`);
            }
        } else if (link.href) {
            // Якщо це звичайний лінк (наприклад, Docs)
            router.push(link.href);
        }
    };

    return (
        <>
            <nav className="fixed top-0 w-full py-4 md:py-5 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 z-[2000]">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link
                        href={PAGES.HOME}
                        className="text-2xl font-black flex items-center gap-2 tracking-tight z-[2100]"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg viewBox="0 0 24 24" className="fill-[#00FF66] w-5 h-5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        QwikTwik
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <button
                                    onClick={() => handleNavigation(link)}
                                    className={`text-sm font-bold transition-colors cursor-pointer ${link.highlight ? 'text-[#00FF66] hover:text-[#00d957]' : 'text-[#94a3b8] hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href={PAGES.LOGIN} className="text-white hover:text-[#00FF66] font-bold text-sm transition-colors">
                            Log In
                        </Link>
                        <Link href={`${PAGES.DOWNLOAD_FREE}`} className="px-5 py-2.5 bg-[#00FF66] text-black font-black rounded-lg shadow-[0_4px_20px_rgba(0,255,102,0.2)] hover:bg-[#00d957] transition-all text-sm">
                            Download Free
                        </Link>
                    </div>

                    {/* Burger Button */}
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

            {/* Mobile Menu */}
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
                                        <button
                                            onClick={() => handleNavigation(link)}
                                            className={`text-4xl font-black text-left w-full cursor-pointer ${link.highlight ? 'text-[#00FF66]' : 'text-white'
                                                }`}
                                        >
                                            {link.label}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="flex flex-col gap-4 mt-8">
                                <Link
                                    href={PAGES.LOGIN}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 text-white font-bold text-center text-xl bg-white/5 border border-white/10 rounded-2xl"
                                >
                                    Log In
                                </Link>
                                <button
                                    onClick={() => handleNavigation({ label: 'Pro Version', sectionId: 'pro' })}
                                    className="w-full py-4 bg-[#00FF66] text-black font-black rounded-2xl text-center text-xl shadow-[0_0_20px_rgba(0,255,102,0.3)] active:scale-95 transition-transform"
                                >
                                    View Pro Plans
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}