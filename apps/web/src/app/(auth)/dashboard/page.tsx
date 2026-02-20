'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PAGES } from '@/constants/pages';

export default function ClientDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    // Дані базуються на технічних параметрах із наданих скріншотів
    const appliedTweaks = [
        { id: 1, name: "Force GPU P0 State", status: "Active", icon: "⚡" }, //
        { id: 2, name: "MSI Interrupt Steering", status: "Active", icon: "🎯" }, //
        { id: 3, name: "MPO Bypass", status: "Active", icon: "🖥️" }, //
        { id: 4, name: "SRUM Data Purge", status: "Idle", icon: "🧹" } //
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">

            {/* SIDEBAR */}
            <aside className="w-full md:w-64 border-r border-white/5 bg-[#0a0a0c] flex flex-col p-6 z-50">
                <div className="mb-10 hidden md:block">
                    <Link href={PAGES.HOME} className="text-xl font-black flex items-center gap-2 text-accent">
                        <svg viewBox="0 0 24 24" className="fill-current w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        QwikTwik
                    </Link>
                </div>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                    {[
                        { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'downloads', label: 'Downloads', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
                        { id: 'settings', label: 'License', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-accent text-black' : 'text-text-muted hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5 hidden md:block">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-xl w-full transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-1 tracking-tight">System Dashboard</h1>
                        <p className="text-text-muted text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            Client Session: ghost_user_99
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="bg-accent/10 border border-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                            Pro Elite Member
                        </span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">

                            {/* STATS CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#131316] border border-white/5 p-6 rounded-2xl">
                                    <p className="text-text-muted text-[10px] font-black uppercase mb-2 tracking-widest">Active Tweak Count</p>
                                    <h3 className="text-4xl font-black text-white">72<span className="text-accent">/</span>75</h3>
                                </div>
                                <div className="bg-[#131316] border border-white/5 p-6 rounded-2xl">
                                    <p className="text-text-muted text-[10px] font-black uppercase mb-2 tracking-widest">Latency Gain</p>
                                    <h3 className="text-4xl font-black text-accent">-14%</h3>
                                </div>
                                <div className="bg-[#131316] border border-white/5 p-6 rounded-2xl">
                                    <p className="text-text-muted text-[10px] font-black uppercase mb-2 tracking-widest">Hardware Sync</p>
                                    <h3 className="text-4xl font-black text-white">Optimal</h3>
                                </div>
                            </div>

                            {/* DETAILED MONITORING */}
                            <div className="grid grid-cols-1 gap-8">
                                <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
                                    <div className="absolute top-0 right-0 p-4 font-mono text-[8px] opacity-20 text-accent">75+ TWEAKS LOADED</div>
                                    <h4 className="text-2xl font-black mb-4">Elite Access Key</h4>
                                    <div className="bg-black/50 border border-accent/30 px-6 py-4 rounded-2xl font-mono text-accent text-lg mb-6 w-full flex justify-between items-center">
                                        <span>QT-99XX-GHOST-PRO</span>
                                        <button className="text-[10px] bg-accent/20 px-2 py-1 rounded hover:bg-accent hover:text-black transition-all">COPY</button>
                                    </div>
                                    <p className="text-text-muted text-xs px-10 leading-relaxed">
                                        Use this key inside the QwikTwik Desktop App to unlock Hardware State Overrides.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'downloads' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="bg-[#131316] border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center shrink-0 border border-accent/30 shadow-glow">
                                    <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-accent stroke-2 fill-none"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-3xl font-black mb-2">Download v1.4.2</h2>
                                    <p className="text-text-muted text-sm mb-6 max-w-lg">Latest stable build includes BIOS Optimizations and MPO bypass fix for Windows 11 23H2.</p>
                                    <button className="px-10 py-4 bg-accent text-black font-black rounded-xl shadow-glow hover:bg-accent-hover hover:-translate-y-1 transition-all">
                                        Initialize Download
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}