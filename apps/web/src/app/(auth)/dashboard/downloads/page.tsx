import { ReleasesService } from '@/services/releases.service';

export default async function DownloadsPage() {
    // В реальності тут буде await ReleasesService.getLatest()
    // Тимчасово замокаємо дані для візуалу, поки бекенд пустий
    const latestRelease = {
        version: "1.4.2",
        changelog: "- Added new Network TCP Tweaks\n- Fixed MSI Interrupt Steering bug\n- Optimized GPU P0 State hook",
        downloadUrl: "#",
        createdAt: new Date().toISOString()
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight">Software Center</h1>
                <p className="text-text-muted text-sm">Download latest version of QwikTwik.</p>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-32 h-32 bg-accent/10 rounded-3xl flex items-center justify-center shrink-0 border border-accent/20 z-10">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-accent stroke-2 fill-none"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>

                <div className="text-center md:text-left flex-1 z-10">
                    <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-2 block">Stable Release</span>
                    <h2 className="text-4xl font-black mb-4">QwikTwik Client v{latestRelease.version}</h2>

                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-6 inline-block w-full max-w-lg text-left">
                        <p className="text-xs font-black uppercase text-text-muted mb-2 tracking-widest">Changelog:</p>
                        <ul className="text-sm text-gray-300 space-y-1 font-mono text-xs whitespace-pre-line">
                            {latestRelease.changelog}
                        </ul>
                    </div>

                    <div>
                        <a
                            href={latestRelease.downloadUrl}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-black font-black rounded-xl shadow-glow hover:bg-accent-hover hover:-translate-y-1 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download for Windows
                        </a>
                        <p className="text-[10px] text-text-muted mt-3">Requires Windows 10/11 (64-bit). 24MB.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}