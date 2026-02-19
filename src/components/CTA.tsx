import Link from 'next/link';
import FadeIn from './FadeIn';

export default function CTA() {
    return (
        <section className="pb-16 md:pb-24 pt-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <div className="group bg-[#131316] border border-accent/30 rounded-3xl p-8 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,255,102,0.1)]">

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[600px] bg-accent blur-[150px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-6 md:mb-8 relative z-10">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2"></span>
                            System Ready
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight text-white relative z-10">
                            Ready to dominate the leaderboard?<br className="hidden md:block" /> Stop playing with lag.
                        </h2>

                        <p className="text-sm md:text-lg text-text-muted mb-8 md:mb-10 max-w-2xl mx-auto relative z-10 px-2">
                            Join 100,000+ gamers and streamers who have already unlocked their PC&apos;s true potential. Takes exactly 1 click.
                        </p>

                        <Link href="#" className="relative z-10 inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-accent text-black font-black rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.3)]  transition-all text-base md:text-lg transform hover:-translate-y-1 w-full sm:w-auto">
                            Download QwikTwik Now
                            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}