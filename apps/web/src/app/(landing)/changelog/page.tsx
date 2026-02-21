'use client';

import FadeIn from '@/components/FadeIn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const updates = [
    {
        version: "v1.4.2",
        date: "March 12, 2024",
        type: "Stable Release",
        changes: [
            "Fixed MPO (Multi-Plane Overlay) registry override for Windows 11 23H2.",
            "Added strict validation for Sleep Study Diagnostics suspension.",
            "Improved Kernel-level Interrupt Steering affinity for AMD Ryzen 7000 series.",
            "Resolved an issue where GPU D0 state forcing would occasionally reset on reboot."
        ]
    },
    {
        version: "v1.4.0",
        date: "February 28, 2024",
        type: "Major Update",
        changes: [
            "Introduced dynamic HAGS (Hardware Accelerated GPU Scheduling) toggling.",
            "Rewritten Network Ping Optimizer engine with raw TCP/IP stack adjustments.",
            "Added 14 new bloatware removal targets (including Edge background services).",
            "Improved 'Streaming Mode' CPU thread allocation for OBS Studio 30.0+."
        ]
    },
    {
        version: "v1.3.5",
        date: "January 15, 2024",
        type: "Patch",
        changes: [
            "Optimized Memory I/O Overdrive for NVMe Gen4 drives.",
            "Fixed false positive detection in Windows Defender for the telemetry blocker.",
            "Reduced QwikTwik background memory footprint from 45MB to 12MB."
        ]
    }
];

export default function Changelog() {
    return (
        <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <FadeIn>
                    <div className="mb-12 md:mb-20 text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-6">
                            System Logs
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Changelog</h1>
                        <p className="text-text-muted text-base md:text-lg">
                            Tracking continuous improvements to the QwikTwik engine.
                        </p>
                    </div>
                </FadeIn>

                <div className="relative border-l-2 border-white/5 ml-3 md:ml-0 md:pl-8">
                    {updates.map((update, index) => (
                        <FadeIn key={update.version} delay={index * 0.1}>
                            <div className="mb-12 relative pl-6 md:pl-0">
                                <div className="absolute w-4 h-4 bg-[#050505] border-2 border-accent rounded-full -left-[35px] md:-left-[41px] top-1"></div>

                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                                    <h2 className="text-2xl font-black font-mono text-white">{update.version}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-text-muted text-sm">{update.date}</span>
                                        <span className="px-2 py-0.5 bg-white/5 text-white/70 text-[10px] uppercase tracking-wider rounded font-bold">
                                            {update.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#131316] border border-white/5 rounded-2xl p-6 md:p-8">
                                    <ul className="space-y-3">
                                        {update.changes.map((change, i) => (
                                            <li key={i} className="flex items-start text-sm md:text-base text-text-muted">
                                                <span className="text-accent mr-3 mt-0.5">➔</span>
                                                <span className="leading-relaxed">{change}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    );
}