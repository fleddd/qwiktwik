'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/FadeIn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Дані залишаються тими самими
const docsData = [
    {
        id: 'gpu',
        title: 'GPU & Graphics',
        icon: <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>,
        articles: [
            {
                title: 'Multi-Plane Overlay (MPO)',
                tags: ['Latency', 'Stuttering'],
                whatItIs: 'MPO is a Windows feature that prevents the GPU from combining video planes. While designed to improve CPU load, it often drastically reduces gaming efficiency and causes flickering.',
                howWeFixIt: 'QwikTwik deploys a proprietary registry override to safely disable MPO routing, ensuring raw, unfiltered frame delivery directly to your monitor.'
            },
            {
                title: 'Hardware Accelerated GPU Scheduling (HAGS)',
                tags: ['FPS Boost', 'Memory'],
                whatItIs: 'HAGS allows the GPU to manage its own memory and tasks more efficiently, which reduces the overhead and latency placed on the CPU.',
                howWeFixIt: 'Our engine automatically detects your architecture and forces optimal HAGS states, bypassing Windows\' default conservative scheduling.'
            },
            {
                title: 'P0 Power State Alignment',
                tags: ['Hardware', 'Consistency'],
                whatItIs: 'Modern GPUs try to save energy by constantly shifting between power states. Force P0 State keeps the GPU in its highest power state to prevent unexpected power-downs during gameplay.',
                howWeFixIt: 'We lock the PCIe bus communication to strictly prohibit lower power states (like D1-D3) while a game is active.'
            }
        ]
    },
    {
        id: 'kernel',
        title: 'Kernel & CPU',
        icon: <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>,
        articles: [
            {
                title: 'Interrupt Steering & MSI',
                tags: ['Kernel', 'Input Lag'],
                whatItIs: 'Interrupt steering manages the assignment of hardware interrupts to specific CPU cores. Optimizing MSI (Message Signal Interrupts) reduces processing delay by efficiently handling these events, drastically improving responsiveness.',
                howWeFixIt: 'QwikTwik calculates the optimal core affinity for your specific CPU topology and binds input devices directly to high-priority threads.'
            },
            {
                title: 'Timer Resolution (TimerRes)',
                tags: ['System Clock', 'Hit Reg'],
                whatItIs: 'Windows uses an internal clock to process events. Adjusting TimerRes changes how often the system kernel updates these internal clocks and interrupts, which is critical for frame pacing.',
                howWeFixIt: 'Our utility serializes timer expiration and forces the maximum possible resolution without causing race conditions.'
            },
            {
                title: 'Virtual Based Security (VBS)',
                tags: ['Security', 'Performance'],
                whatItIs: 'VBS isolates a secure region of memory. However, disabling Virtual Based Security is known to reduce memory isolation overhead and significantly boost gaming performance.',
                howWeFixIt: 'QwikTwik safely suspends VBS and related hypervisor features (Hyper-V) during gaming sessions.'
            }
        ]
    },
    {
        id: 'debloat',
        title: 'Telemetry & Debloat',
        icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
        articles: [
            {
                title: 'System Telemetry & SRUM',
                tags: ['Privacy', 'Background Apps'],
                whatItIs: 'Windows constantly tracks app and system activity. Disabling telemetry stops Windows from collecting system data and sending it to Microsoft, reducing background processes.',
                howWeFixIt: 'We deploy an aggressive blocklist that nullifies Microsoft\'s data collection servers and clears all existing System Resource Usage Monitor (SRUM) data.'
            },
            {
                title: 'Sleep Study Diagnostics',
                tags: ['CPU Spikes'],
                whatItIs: 'A hidden Windows tool that monitors sleep states. Disabling the Sleep Study tool reduces unnecessary background processing and disk writes.',
                howWeFixIt: 'QwikTwik forcefully disables the diagnostic tracking tasks that Microsoft hides deep within the Task Scheduler.'
            }
        ]
    }
];

export default function KnowledgeBase() {
    const [activeTab, setActiveTab] = useState(docsData[0].id);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Автоматичне центрування активної категорії при натисканні
    const handleTabClick = (id: string, e: React.MouseEvent) => {
        setActiveTab(id);
        const target = e.currentTarget as HTMLElement;
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen selection:bg-accent/30">
            <Navbar />

            <main className="pt-24 md:pt-36 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    <FadeIn>
                        <div className="mb-8 md:mb-16 border-b border-white/5 pb-8">
                            <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-4">
                                Documentation
                            </div>
                            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-4">Knowledge Base</h1>
                            <p className="text-text-muted text-sm md:text-lg max-w-2xl leading-relaxed">
                                Understanding the science behind system optimization.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start relative">

                        {/* ОПТИМІЗОВАНА НАВІГАЦІЯ КАТЕГОРІЙ */}
                        <FadeIn delay={0.1} className="w-full md:w-64 flex-shrink-0 sticky top-[72px] md:top-32 z-40 bg-[#050505]/95 backdrop-blur-md md:bg-transparent -mx-4 px-4 md:mx-0 md:px-0 py-3 md:py-0 border-b border-white/5 md:border-0">
                            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 hidden md:block px-4">Categories</h3>

                            <div className="relative group">
                                {/* Контейнер зі скролом без видимих смуг */}
                                <div
                                    ref={scrollRef}
                                    className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar scroll-smooth snap-x touch-pan-x px-4 md:px-0"
                                >
                                    {docsData.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={(e) => handleTabClick(category.id, e)}
                                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap snap-center ${activeTab === category.id
                                                ? 'bg-accent/10 text-accent font-bold ring-1 ring-accent/30'
                                                : 'bg-white/5 text-text-muted hover:text-white'
                                                }`}
                                        >
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
                                                {category.icon}
                                            </svg>
                                            <span className="text-xs md:text-sm">{category.title}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Тіні-підказки для скролу на мобілці */}
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none md:hidden" />
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none md:hidden" />
                            </div>
                        </FadeIn>

                        {/* КОНТЕНТ */}
                        <div className="flex-1 min-w-0 pb-20 w-full">
                            <AnimatePresence mode="wait">
                                {docsData.map((category) => category.id === activeTab && (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-xl md:text-3xl font-extrabold flex items-center gap-2">
                                            <span className="text-accent">/</span> {category.title}
                                        </h2>

                                        {category.articles.map((article, idx) => (
                                            <div key={idx} className="bg-[#131316] border border-white/5 rounded-2xl p-5 md:p-10 shadow-lg">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {article.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 bg-white/5 text-text-muted text-[9px] font-bold uppercase tracking-wider rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className="text-lg md:text-2xl font-bold mb-4 text-white leading-tight">{article.title}</h3>
                                                <div className="space-y-6 text-xs md:text-base leading-relaxed text-text-muted">
                                                    <div>
                                                        <h4 className="text-white font-bold mb-2 text-[10px] md:text-sm uppercase tracking-wider flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-accent rounded-full" /> What is it?
                                                        </h4>
                                                        <p>{article.whatItIs}</p>
                                                    </div>
                                                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                                                        <h4 className="text-accent font-bold mb-2 text-[10px] md:text-sm uppercase tracking-wider">How QwikTwik Optimizes It</h4>
                                                        <p className="text-white font-medium">{article.howWeFixIt}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}