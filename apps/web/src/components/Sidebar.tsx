'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import type { UserProfileResponse } from '@repo/types';

// Меню для звичайного користувача
const USER_MENU_ITEMS = [
    { id: 'overview', path: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'devices', path: '/dashboard/devices', label: 'My Devices', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'downloads', path: '/dashboard/downloads', label: 'Downloads', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
    { id: 'billing', path: '/dashboard/billing', label: 'Billing & Plan', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'reviews', path: '/dashboard/reviews', label: 'Write Review', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'settings', path: '/dashboard/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

// Меню для адміністратора
const ADMIN_MENU_ITEMS = [
    { id: 'admin-overview', path: '/dashboard/admin', label: 'Overview', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
    { id: 'admin-users', path: '/dashboard/admin/users', label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'admin-releases', path: '/dashboard/admin/releases', label: 'Releases', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { id: 'admin-transactions', path: '/dashboard/admin/transactions', label: 'Transactions', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'admin-hardware', path: '/dashboard/admin/devices', label: 'Hardware', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { id: 'admin-reviews', path: '/dashboard/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
];

export default function Sidebar({ user }: { user: UserProfileResponse }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isAdminRoute = pathname.startsWith('/dashboard/admin');
    const activeMenu = isAdminRoute ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        Cookies.remove('accessToken', { path: '/' });
        router.push('/login');
        router.refresh();
    };

    const plan = user?.subscription?.plan || 'FREE';
    const isPro = plan === 'PRO';

    return (
        <>
            {/* МОБІЛЬНА ВЕРХНЯ ПАНЕЛЬ */}
            <div className="md:hidden flex items-center justify-between p-5 bg-[#0a0a0c] border-b border-white/5 sticky top-0 z-40">
                <Link href="/dashboard" className="text-xl font-black flex items-center gap-2 text-accent">
                    <svg viewBox="0 0 24 24" className="fill-current w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    QwikTwik
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-white hover:text-accent transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* ЗАТЕМНЕННЯ ФОНУ ДЛЯ МОБІЛЬНОГО МЕНЮ */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden touch-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ОСНОВНИЙ САЙДБАР (на десктопі зліва, на мобільному виїжджає) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col p-6 
                transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 
                h-[100dvh] md:h-[100dvh] shrink-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* БЛОК 1: Логотип (shrink-0 не дає йому стиснутися) */}
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <Link href="/dashboard" className="text-xl font-black flex items-center gap-2 text-accent">
                        <svg viewBox="0 0 24 24" className="fill-current w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        <span>QwikTwik</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-text-muted hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* БЛОК 2: Інформація про користувача (shrink-0) */}
                <div className="mb-6 flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl shrink-0">
                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-accent font-black text-lg">{user.name?.charAt(0).toUpperCase() || 'Q'}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.name || 'Ghost Player'}</p>
                            <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                        </div>
                    </div>

                    <span className={`px-4 text-center py-2 rounded-full text-xs font-black uppercase tracking-widest border whitespace-nowrap ${isPro ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-white'
                        }`}>
                        {plan} Plan
                    </span>
                </div>

                {/* БЛОК 3: Кнопка Admin/User (shrink-0) */}
                {user.role === 'ADMIN' && (
                    <div className="mb-4 pb-4 border-b border-white/5 shrink-0">
                        <Link
                            href={isAdminRoute ? '/dashboard' : '/dashboard/admin'}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#00FF66]/20"
                        >
                            {isAdminRoute ? '← Switch to User' : '⚡ Switch to Admin'}
                        </Link>
                    </div>
                )}

                {/* БЛОК 4: Навігація (flex-1 min-h-0 - ДОЗВОЛЯЄ СКРОЛІНГ і не виштовхує нижні елементи) */}
                <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 no-scrollbar pb-2">
                    {activeMenu.map((item) => {
                        const isActive = item.path === '/dashboard' || item.path === '/dashboard/admin'
                            ? pathname === item.path
                            : pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${isActive ? 'bg-accent text-black shadow-glow' : 'text-text-muted hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* БЛОК 5: Нижні дії (shrink-0 mt-auto - ЗАВЖДИ внизу) */}
                <div className="shrink-0 mt-auto pt-4 flex flex-col gap-2 border-t border-white/5 bg-[#0a0a0c]">
                    <Link
                        href={"/"}
                        className="flex items-center gap-3 px-4 py-3 text-text-muted font-bold text-sm hover:bg-neutral-500/10 rounded-xl w-full transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Back to site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-xl w-full transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>

            </aside>
        </>
    );
}