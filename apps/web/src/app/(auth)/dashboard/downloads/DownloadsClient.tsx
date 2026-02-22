'use client';

import { useState } from 'react';

export default function DownloadsClient({ releases }: { releases: any[] }) {
    // Стейт для збереження вибраного релізу (за замовчуванням - перший у списку, тобто найновіший)
    const [selectedRelease, setSelectedRelease] = useState(releases[0]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Software Center</h1>
                <p className="text-text-muted text-sm">Get the official QwikTwik Desktop Client for Windows.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* ЛІВА ЧАСТИНА - ДЕТАЛІ ВИБРАНОГО РЕЛІЗУ */}
                <div className="flex-1 bg-[#131316] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="w-32 h-32 bg-accent/10 rounded-3xl flex items-center justify-center shrink-0 border border-accent/20 z-10">
                        <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-accent stroke-2 fill-none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>

                    <div className="text-center md:text-left flex-1 z-10">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <span className="text-accent text-[10px] font-black uppercase tracking-widest block">
                                {selectedRelease.id === releases[0].id ? 'Latest Stable Release' : 'Archived Version'}
                            </span>
                            <span className="px-2 py-0.5 bg-white/5 text-white/50 text-[9px] font-bold rounded uppercase">Verified</span>
                        </div>

                        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">
                            QwikTwik v{selectedRelease.version}
                        </h2>

                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-6 inline-block w-full max-w-lg text-left">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">Changelog:</p>
                            <ul className="text-sm text-gray-300 space-y-1 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                                {selectedRelease.changelog || "Bug fixes and stability improvements."}
                            </ul>
                        </div>

                        <div>
                            <a
                                href={selectedRelease.downloadUrl}
                                download={`QwikTwik-v${selectedRelease.version}.exe`}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-black font-black rounded-xl shadow-glow hover:bg-accent-hover hover:-translate-y-1 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download v{selectedRelease.version}
                            </a>
                            <p className="text-[10px] text-text-muted mt-4 uppercase font-bold tracking-tighter">
                                Build: {new Date(selectedRelease.createdAt).toLocaleDateString()} • x64 Architecture
                            </p>
                        </div>
                    </div>
                </div>

                {/* ПРАВА ЧАСТИНА - ІСТОРІЯ ВЕРСІЙ */}
                <div className="w-full lg:w-72 xl:w-80 bg-[#131316] border border-white/5 rounded-3xl p-6 flex flex-col h-full max-h-[500px]">
                    <h3 className="font-bold uppercase tracking-widest text-text-muted mb-4 text-xs">Version History</h3>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                        {releases.map((release) => {
                            const isSelected = selectedRelease.id === release.id;
                            const isLatest = release.id === releases[0].id;

                            return (
                                <button
                                    key={release.id}
                                    onClick={() => setSelectedRelease(release)}
                                    className={`cursor-pointer text-left p-4 rounded-xl border transition-all flex flex-col ${isSelected
                                        ? 'bg-accent/10 border-accent/30'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-center w-full mb-1">
                                        <span className={`font-black uppercase tracking-tight ${isSelected ? 'text-accent' : 'text-white'}`}>
                                            v{release.version}
                                        </span>
                                        {isLatest && (
                                            <span className="text-[9px] bg-accent text-black px-1.5 py-0.5 rounded font-black uppercase">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-text-muted font-mono">
                                        {new Date(release.createdAt).toLocaleDateString()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}