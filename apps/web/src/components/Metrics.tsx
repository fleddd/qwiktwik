'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

type ProcessType = 'Game' | 'System' | 'Background';
type ProcessStatus = 'Prioritized' | 'Struggling' | 'High Usage' | 'Running' | 'Suspended' | 'Optimizing' | 'Terminated';

interface Process {
    id: string;
    name: string;
    type: ProcessType;
    status: ProcessStatus;
    cpu: number;
    ram: number;
    color: string;
    bg: string;
}

const baseProcesses: Process[] = [
    { id: 'cs2', name: 'cs2.exe', type: 'Game', status: 'Struggling', cpu: 42.5, ram: 2100, color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
    { id: 'qwik', name: 'QwikTwik.exe', type: 'System', status: 'Running', cpu: 0.1, ram: 45, color: 'text-text-muted', bg: 'bg-transparent' },
];

const junkPool = [
    'chrome.exe', 'Discord.exe', 'Spotify.exe', 'svchost.exe', 'SearchIndexer.exe',
    'OneDrive.exe', 'msmpeng.exe', 'SteamWebHelper.exe', 'EpicGamesLauncher.exe', 'AdobeUpdate.exe'
];

export default function Metrics() {
    type StateType = 'unoptimized' | 'optimizing' | 'optimized';
    const [boostState, setBoostState] = useState<StateType>('unoptimized');
    const [processes, setProcesses] = useState<Process[]>(baseProcesses);
    const [fps, setFps] = useState(112);
    const [ping, setPing] = useState(48);
    const nextId = useRef(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (boostState === 'unoptimized') {
            interval = setInterval(() => {
                setProcesses(prev => {
                    let newProcs = [...prev];

                    newProcs = newProcs.map(p => {
                        if (p.id === 'cs2') return { ...p, cpu: Math.max(30, p.cpu + (Math.random() * 6 - 3)), ram: Math.max(2000, p.ram + (Math.random() * 50 - 25)) };
                        if (p.id === 'qwik') return p;
                        return { ...p, cpu: Math.max(0, p.cpu + (Math.random() * 4 - 2)), ram: Math.max(50, p.ram + (Math.random() * 20 - 10)) };
                    });

                    // ЗМІНА 1: Максимум 5 процесів замість 7, щоб таблиця була нижчою
                    if (newProcs.length < 5 && Math.random() > 0.4) {
                        const randomName = junkPool[Math.floor(Math.random() * junkPool.length)];
                        if (!newProcs.find(p => p.name === randomName)) {
                            newProcs.push({
                                id: `junk-${nextId.current++}`,
                                name: randomName,
                                type: 'Background',
                                status: 'High Usage',
                                cpu: 5 + Math.random() * 15,
                                ram: 100 + Math.random() * 500,
                                color: 'text-red-400',
                                bg: 'bg-red-500/5'
                            });
                        }
                    }

                    if (newProcs.length > 3 && Math.random() > 0.7) {
                        const junkIndices = newProcs.map((p, i) => p.id !== 'cs2' && p.id !== 'qwik' ? i : -1).filter(i => i !== -1);
                        if (junkIndices.length > 0) {
                            const indexToRemove = junkIndices[Math.floor(Math.random() * junkIndices.length)];
                            newProcs.splice(indexToRemove, 1);
                        }
                    }

                    return newProcs;
                });

                setFps(112 + Math.floor(Math.random() * 15 - 7));
                setPing(48 + Math.floor(Math.random() * 8 - 4));
            }, 800);

        } else if (boostState === 'optimizing') {
            interval = setInterval(() => {
                setProcesses(prev => prev.map(p => {
                    if (p.id === 'cs2') return { ...p, status: 'Prioritized', color: 'text-accent', bg: 'bg-accent/10', cpu: p.cpu + (88 - p.cpu) * 0.3, ram: 4250 };
                    if (p.id === 'qwik') return { ...p, status: 'Optimizing', color: 'text-blue-400', bg: 'bg-blue-500/10', cpu: 2.5 };
                    return { ...p, status: 'Suspended', color: 'text-text-muted', bg: 'bg-transparent', cpu: p.cpu * 0.5, ram: p.ram * 0.8 };
                }));
            }, 100);

            setTimeout(() => {
                setProcesses(prev => {
                    const essential = prev
                        .filter(p => p.id === 'cs2' || p.id === 'qwik')
                        .map(p => {
                            if (p.id === 'cs2') return { ...p, cpu: 92.4 };
                            if (p.id === 'qwik') return { ...p, status: 'Running' as ProcessStatus, color: 'text-accent', bg: 'bg-transparent', cpu: 0.1 };
                            return p;
                        });

                    const suspended = prev
                        .filter(p => p.id !== 'cs2' && p.id !== 'qwik')
                        .slice(0, 1) // ЗМІНА 2: Залишаємо тільки 1 "мертвий" процес для вигляду
                        .map(p => ({ ...p, status: 'Terminated' as ProcessStatus, cpu: 0, ram: 15, color: 'text-white/20' }));

                    return [...essential, ...suspended];
                });
                setBoostState('optimized');
            }, 1500);

        } else if (boostState === 'optimized') {
            interval = setInterval(() => {
                setProcesses(prev => prev.map(p => {
                    if (p.id === 'cs2') return { ...p, cpu: 92.4 + (Math.random() * 2 - 1), ram: 4250 + (Math.random() * 10 - 5) };
                    return p;
                }));
                setFps(145 + Math.floor(Math.random() * 6));
                setPing(12 + Math.floor(Math.random() * 2));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [boostState]);

    const triggerBoost = () => {
        if (boostState === 'unoptimized') setBoostState('optimizing');
        else if (boostState === 'optimized') {
            setBoostState('unoptimized');
            setProcesses(baseProcesses);
        }
    };

    return (
        <section className="py-12 relative overflow-hidden flex items-center min-h-screen" id="features">
            <div className="max-w-5xl mx-auto px-6 w-full">

                <FadeIn>
                    <div className="flex flex-col items-center mb-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Stop letting background apps ruin your aim.</h2>

                        <button
                            onClick={triggerBoost}
                            disabled={boostState === 'optimizing'}
                            className={`mt-2 cursor-pointer px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-2
                                ${boostState === 'unoptimized' ? 'bg-accent text-black shadow-glow hover:bg-accent-hover hover:-translate-y-1 hover:shadow-glow-hover' :
                                    boostState === 'optimizing' ? 'bg-accent/20 text-accent cursor-wait' :
                                        'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {boostState === 'unoptimized' && <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Simulate QwikBoost</>}
                            {boostState === 'optimizing' && 'Freezing Background Tasks...'}
                            {boostState === 'optimized' && 'Reset Simulation'}
                        </button>
                    </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-charcoal border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-text-muted text-xs font-medium mb-1">In-Game FPS</p>
                                <div className={`text-3xl font-extrabold transition-colors duration-500 ${boostState === 'optimized' ? 'text-accent' : 'text-white'}`}>{Math.round(fps)}</div>
                            </div>
                        </div>
                        <div className="bg-charcoal border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-text-muted text-xs font-medium mb-1">System Latency</p>
                                <div className={`text-3xl font-extrabold transition-colors duration-500 ${boostState === 'optimized' ? 'text-accent' : 'text-red-400'}`}>{Math.round(ping)}<span className="text-lg">ms</span></div>
                            </div>
                        </div>
                        <div className="bg-charcoal border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-text-muted text-xs font-medium mb-1">Background Threads</p>
                                <div className={`text-3xl font-extrabold transition-colors duration-500 ${boostState === 'optimized' ? 'text-accent' : 'text-red-400'}`}>
                                    {boostState === 'optimized' ? '0' : processes.length * 14}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative bg-[#0f0f11]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm min-h-[280px]">

                        <div className="bg-white/5 border-b border-white/10 px-4 py-2.5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                </div>
                                <span className="text-text-muted font-sans text-xs font-medium ml-2">QwikTwik Process Monitor</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-white/5 text-text-muted font-sans text-[10px] uppercase tracking-wider font-semibold">
                            <div className="col-span-5 md:col-span-4">Name</div>
                            <div className="col-span-3 hidden md:block">Status</div>
                            <div className="col-span-3 md:col-span-2 text-right">CPU</div>
                            <div className="col-span-4 md:col-span-3 text-right">Memory</div>
                        </div>

                        <div className="flex flex-col">
                            <AnimatePresence mode="popLayout">
                                {processes.map((proc) => (
                                    <motion.div
                                        layout
                                        key={proc.id}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`grid grid-cols-12 gap-4 px-6 py-2.5 border-b border-white/5 last:border-0 items-center transition-colors duration-300 ${proc.bg} border-l-2 ${proc.id === 'cs2' || proc.id === 'qwik' ? 'border-l-transparent' : 'border-l-red-500/30'}`}
                                    >
                                        <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className={`font-medium text-xs ${proc.status === 'Terminated' ? 'text-white/30 line-through' : 'text-white'}`}>{proc.name}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-3 hidden md:flex items-center">
                                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold transition-colors duration-300 ${proc.status === 'Prioritized' ? 'bg-accent/20 text-accent border border-accent/30' :
                                                proc.status === 'Terminated' ? 'bg-transparent text-white/20 border border-white/10' :
                                                    proc.status === 'Suspended' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                        proc.status === 'Optimizing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse' :
                                                            proc.status === 'Struggling' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {proc.status}
                                            </span>
                                        </div>

                                        <div className={`col-span-3 md:col-span-2 text-right text-xs font-bold transition-colors duration-300 ${proc.color}`}>
                                            {proc.cpu.toFixed(1)}%
                                        </div>

                                        <div className={`col-span-4 md:col-span-3 text-right text-xs transition-colors duration-300 ${proc.color}`}>
                                            {Math.round(proc.ram).toLocaleString('en-US')} MB
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}