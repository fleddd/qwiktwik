import Link from 'next/link';
import FadeIn from './FadeIn';
import { PAGES } from '@/constants/pages';
import Slider from './Slider';

export default function Features() {
    const features = [
        {
            icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
            title: "Zero-Trace Debloat",
            stat: "-2.4GB",
            statLabel: "Idle RAM Usage",
            desc: "Microsoft hides dozens of tracking tasks. We surgically remove bloatware and telemetry using our proprietary script engine.",
            terminal: [
                "> Initializing zero-trace protocol...",
                "> Purging deep-level OS telemetry...",
                "> Bypassing registry lockouts...",
                "> Status: [ENCRYPTED PAYLOAD APPLIED]"
            ]
        },
        {
            icon: <><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></>,
            title: "Kernel-Level Priorities",
            stat: "100%",
            statLabel: "CPU Game Focus",
            desc: "Bypass Windows' default scheduler. We force custom resource policy sets to eliminate background interruptions.",
            terminal: [
                "> Injecting custom thread logic...",
                "> Overriding default power states...",
                "> Locking CPU frequency offsets...",
                "> Status: [PROPRIETARY KERNEL TWEAK]"
            ]
        },
        {
            icon: <><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></>,
            title: "GPU Pipeline Unchained",
            stat: "+28%",
            statLabel: "1% Low FPS Boost",
            desc: "Standard Windows drivers hold your GPU back. We force strict rendering registry parameters for buttery-smooth frametimes.",
            terminal: [
                "> Bypassing DWM limitations...",
                "> Reconfiguring rendering queues...",
                "> Injecting hexadecimal overrides...",
                "> Status: [CLASSIFIED OFFSET]"
            ]
        },
        {
            icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></>,
            title: "Hardware State Override",
            stat: "0.0ms",
            statLabel: "Power Throttling",
            desc: "Unlock experimental hardware potential. We force PCI/PCIe devices into fully active states and disable polling delays.",
            terminal: [
                "> Modifying hardware interrupts...",
                "> Forcing strict device polling...",
                "> Disabling state coalescing...",
                "> Status: [RESTRICTED ACCESS]"
            ]
        },
        {
            icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>,
            title: "Raw Input Synchronization",
            stat: "< 1ms",
            statLabel: "Click-to-Photon",
            desc: "Achieve true 1:1 tracking. By optimizing message signal interrupts, your clicks register on the screen instantly.",
            terminal: [
                "> Rewriting input buffer values...",
                "> Syncing core-to-photon latency...",
                "> Halting interrupt moderation...",
                "> Status: [ALGORITHM INJECTED]"
            ]
        },
        {
            icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>,
            title: "Memory I/O Overdrive",
            stat: "3x",
            statLabel: "Faster Asset Loading",
            desc: "Stop disk bottlenecks in open-world games. We lock memory pages and flush standby cache loops efficiently.",
            terminal: [
                "> Restructuring page file allocation...",
                "> Flushing standby cache loops...",
                "> Disabling I/O access delays...",
                "> Status: [QWIK-CORE EXECUTED]"
            ]
        }
    ];

    return (
        <section className="scroll-mt-20 py-16 md:py-24 bg-gradient-to-b from-transparent via-[#0f0f11]/80 to-transparent relative overflow-hidden" id="features" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <div className="text-center mb-12 md:mb-20 relative">
                        <div className="inline-flex items-center px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest mb-4 md:mb-6">
                            Proprietary Engine
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">75+ Deep System Tweaks.</h2>
                        <p className="text-text-muted text-base md:text-xl max-w-3xl mx-auto leading-relaxed px-2 mb-6">
                            We don&apos;t just clean your registry. QwikTwik deploys classified algorithms to manipulate kernel-level steering and force absolute hardware compliance.
                        </p>

                        <Link href={PAGES.DOCS} className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors group">
                            Explore the Science Behind QwikTwik
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-2 transform group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                    </div>
                </FadeIn>

                {/* ВИКОРИСТАННЯ НОВОГО СЛАЙДЕРА */}
                <Slider desktopGridClasses="sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <FadeIn key={i} delay={i * 0.1} className="h-full">
                            <div
                                tabIndex={0}
                                className="group relative bg-[#131316] border border-white/5 rounded-2xl overflow-hidden h-[360px] md:h-[340px] hover:border-accent/40 focus:border-accent/40 transition-all duration-500 shadow-xl cursor-pointer w-full"
                            >
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col transition-transform duration-500 group-hover:-translate-y-full group-focus:-translate-y-full">
                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 stroke-white stroke-2 fill-none">{f.icon}</svg>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl md:text-3xl font-black text-white">{f.stat}</div>
                                            <div className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">{f.statLabel}</div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{f.title}</h4>
                                        <p className="text-sm text-text-muted leading-relaxed mb-6 md:mb-0">{f.desc}</p>

                                        <div className="absolute -bottom-2 right-0 md:hidden flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                                            <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Tap to Decrypt</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-[#0a0a0c] p-6 md:p-8 flex flex-col justify-center translate-y-full group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-500">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_rgba(0,255,102,0.8)]"></div>
                                    <h5 className="text-accent text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                        Engine Telemetry
                                    </h5>
                                    <ul className="space-y-2 md:space-y-3 font-mono text-xs md:text-[13px] text-white/70">
                                        {f.terminal.map((line, j) => {
                                            const isStatus = j === f.terminal.length - 1;
                                            return (
                                                <li key={j} className={`flex items-start ${isStatus ? 'text-accent font-bold mt-4' : ''}`}>
                                                    <span className={`mr-2 ${isStatus ? 'text-accent' : 'text-white/30'}`}>{'>'}</span>
                                                    <span className="leading-snug">{line}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </Slider>
            </div>
        </section>
    );
}