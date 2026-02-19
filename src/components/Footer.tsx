import Link from 'next/link';
import { PAGES } from '@/constants/pages';

export default function Footer() {
    const footerLinks = [
        { label: 'Knowledge Base', href: PAGES.DOCS },
        { label: 'Changelog', href: PAGES.CHANGELOG },
        { label: 'Privacy Policy', href: PAGES.LEGAL },
        { label: 'Terms of Service', href: PAGES.LEGAL },
        { label: 'Discord Community', href: '#' },
        { label: 'Contact Support', href: '#' }
    ];

    return (
        <footer className="border-t border-white/10 bg-[#050505] pt-12 md:pt-16 pb-8 md:pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 text-center md:text-left">
                    <Link href={PAGES.HOME} className="text-2xl font-black flex items-center gap-2 text-white hover:text-accent transition-colors">
                        <svg viewBox="0 0 24 24" className="fill-current w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        QwikTwik
                    </Link>

                    <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8">
                        {footerLinks.map((link, i) => (
                            <Link key={i} href={link.href} className="text-xs md:text-sm font-medium text-text-muted hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
                    <div className="text-center md:text-left text-[10px] md:text-xs text-text-muted/60 font-medium uppercase tracking-wider">
                        &copy; {new Date().getFullYear()} QwikTwik Performance Solutions. All rights reserved.
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-text-muted/40 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                        All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
    );
}