'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

// Дані для модів та їхньої статистики
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
            bgActive: 'bg-sky-400/5',
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
            text: 'text-accent',
            bgActive: 'bg-accent/5',
            borderActive: 'border-accent/30',
            iconBgActive: 'bg-accent/20',
            glow: 'bg-accent',
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
            bgActive: 'bg-purple-400/5',
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
    const [activeMode, setActiveMode] = useState(modesData[1]); // Gaming Mode за замовчуванням

    return (
        <section className="relative py-24" id="modes">
            {/* Динамічне світіння фону */}
            <div
                className={`absolute -left-[10%] top-[30%] w-[400px] h-[400px] blur-[150px] rounded-full opacity-10 -z-10 transition-colors duration-700 ${activeMode.theme.glow}`}
            ></div>

            <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Adapt on the fly. Three modes, zero restarts.</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">Switch between maximum gaming performance and silent background operation instantly with just one click.</p>
                    </div>
                </FadeIn>

                {/* Картки вибору модів */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {modesData.map((mode, index) => {
                        const isActive = activeMode.id === mode.id;

                        return (
                            <FadeIn key={mode.id} delay={index * 0.1}>
                                <div
                                    onClick={() => setActiveMode(mode)}
                                    className={`cursor-pointer backdrop-blur-md border rounded-2xl p-8 transition-all duration-300 h-full
                                        ${isActive
                                            ? `${mode.theme.bgActive} ${mode.theme.borderActive} shadow-[0_8px_30px_rgba(0,0,0,0.12)] -translate-y-1`
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300
                                            ${isActive ? mode.theme.iconBgActive : 'bg-white/10'}
                                            ${isActive ? mode.theme.text : 'text-text-muted'}
                                        `}
                                    >
                                        {mode.icon}
                                    </div>
                                    <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${isActive ? mode.theme.text : 'text-white'}`}>
                                        {mode.title}
                                    </h3>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        {mode.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>

                {/* Панель зі статистикою */}
                <FadeIn delay={0.4}>
                    <div className="relative overflow-hidden bg-bg-charcoal border border-white/5 rounded-2xl p-8 md:p-10">
                        {/* Маленьке фонове світіння всередині панелі статків */}
                        <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-[0.05] transition-colors duration-700 pointer-events-none ${activeMode.theme.glow}`}></div>

                        <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Live Telemetry Changes</h4>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMode.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                            >
                                {activeMode.stats.map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-text-muted text-sm mb-2">{stat.label}</span>
                                        <span className={`text-xl md:text-2xl font-bold tracking-tight ${activeMode.theme.text}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}