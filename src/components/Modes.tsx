'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

const modesData = [
    {
        id: 'balanced',
        title: 'Balanced Mode',
        desc: 'Perfect for daily tasks. Lowers CPU frequency, keeps fans completely silent, and saves power while browsing or working.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
        ),
        theme: {
            text: 'text-sky-400',
            bgActive: 'bg-sky-400/10',
            borderActive: 'border-sky-400/30',
            iconBgActive: 'bg-sky-400/20',
            glow: 'bg-sky-400',
        },
        stats: [
            { label: 'CPU Target', value: 'Base Clock' },
            { label: 'Fan Profile', value: 'Silent (< 20dB)' },
            { label: 'Power Draw', value: 'Minimal' },
            { label: 'Background Apps', value: 'Allowed' }
        ]
    },
    {
        id: 'gaming',
        title: 'Gaming Mode',
        desc: 'Esports ready. Suspends background processes, unparks CPU cores, disables Windows telemetry, and ensures 0% stuttering.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        ),
        theme: {
            text: 'text-[#00FF66]',
            bgActive: 'bg-[#00FF66]/10',
            borderActive: 'border-[#00FF66]/30',
            iconBgActive: 'bg-[#00FF66]/20',
            glow: 'bg-[#00FF66]',
        },
        stats: [
            { label: 'CPU Target', value: 'Max Boost' },
            { label: 'Core Parking', value: 'Disabled' },
            { label: 'System Latency', value: 'Ultra Low' },
            { label: 'Telemetry', value: 'Blocked' }
        ]
    },
    {
        id: 'streaming',
        title: 'Streaming Mode',
        desc: 'The perfect equilibrium. Allocates dedicated CPU threads to OBS/Streamlabs ensuring zero dropped frames.',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>
            </svg>
        ),
        theme: {
            text: 'text-purple-400',
            bgActive: 'bg-purple-400/10',
            borderActive: 'border-purple-400/30',
            iconBgActive: 'bg-purple-400/20',
            glow: 'bg-purple-400',
        },
        stats: [
            { label: 'Thread Priority', value: 'OBS Highest' },
            { label: 'Encoder', value: 'Optimized' },
            { label: 'Dropped Frames', value: '0%' },
            { label: 'Network QoS', value: 'Streaming' }
        ]
    }
];

export default function Modes() {
    const [activeMode, setActiveMode] = useState(modesData[1]);

    return (
        <section className="relative py-16 md:py-24" id="modes">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                <FadeIn>
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Adapt on the fly.</h2>
                        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mx-auto">Three distinct profiles. Zero system restarts required.</p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-[#131316] border border-white/5 rounded-3xl p-5 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden shadow-2xl">

                        {/* Фонове світіння */}
                        <div className={`absolute top-1/2 -right-20 w-96 h-96 blur-[120px] rounded-full opacity-[0.07] pointer-events-none transition-colors duration-700 ${activeMode.theme.glow} -translate-y-1/2`}></div>

                        {/* Навігація (Адаптовано під мобільні без скролу) */}
                        <div className="flex flex-row md:flex-col gap-2 md:gap-3 shrink-0 md:w-64 relative z-10 w-full">
                            {modesData.map((mode) => {
                                const isActive = activeMode.id === mode.id;
                                // Відрізаємо слово "Mode" для мобілок (напр. "Gaming Mode" -> "Gaming")
                                const shortTitle = mode.title.split(' ')[0];

                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setActiveMode(mode)}
                                        className={`flex-1 cursor-pointer flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 px-2 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300
                                            ${isActive
                                                ? `${mode.theme.bgActive} border ${mode.theme.borderActive} shadow-lg`
                                                : 'bg-white/5 md:bg-transparent border border-transparent hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300
                                            ${isActive ? mode.theme.iconBgActive : 'bg-transparent md:bg-white/5'}
                                            ${isActive ? mode.theme.text : 'text-[#94a3b8]'}
                                        `}>
                                            <div className="scale-75 md:scale-100">{mode.icon}</div>
                                        </div>

                                        <span className={`font-bold transition-colors duration-300 text-[10px] md:text-sm ${isActive ? 'text-white' : 'text-[#94a3b8]'}`}>
                                            <span className="md:hidden">{shortTitle}</span>
                                            <span className="hidden md:inline">{mode.title}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Права панель: Контент */}
                        <div className="flex-1 relative min-h-[350px] md:min-h-0 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMode.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative z-10"
                                >
                                    <div className="mb-8 md:mb-12">
                                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                                            <span className={`w-2 h-2 rounded-full animate-pulse ${activeMode.theme.glow}`}></span>
                                            <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${activeMode.theme.text}`}>
                                                {activeMode.title}
                                            </h3>
                                        </div>
                                        <p className="text-[#94a3b8] text-sm md:text-lg leading-relaxed max-w-xl">
                                            {activeMode.desc}
                                        </p>
                                    </div>

                                    <div className="bg-black/20 md:bg-transparent rounded-2xl p-4 md:p-0 border border-white/5 md:border-transparent">
                                        <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 mb-4 md:mb-5 md:border-b border-white/5 md:pb-3">
                                            Live Telemetry
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                                            {activeMode.stats.map((stat, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[#94a3b8] text-[10px] md:text-sm mb-1 uppercase md:capitalize tracking-wider md:tracking-normal">{stat.label}</span>
                                                    <span className="text-sm md:text-xl font-bold tracking-tight text-white">
                                                        {stat.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section>
    );
}