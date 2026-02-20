import FadeIn from './FadeIn';

export default function Testimonials() {
    const reviews = [
        { text: "QwikTwik literally fixed my micro-stutters in CS2. The real-time switching is magic. I don't even have to think about it anymore.", author: 'Alex "Viper" M.', role: 'Faceit Lvl 10', color: 'from-[#00FF66] to-[#0f0f11]' },
        { text: "I stream Warzone and used to drop frames heavily. The Streaming Mode somehow balanced my CPU perfectly. Highly recommended!", author: 'Sarah T.', role: 'Twitch Affiliate', color: 'from-[#7c3aed] to-[#0f0f11]' },
        { text: "The bloatware removal alone is worth installing this. My idle RAM usage dropped from 4GB to 1.8GB instantly.", author: 'David K.', role: 'Hardware Enthusiast', color: 'from-[#ef4444] to-[#0f0f11]' },
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 md:mb-16 tracking-tight">Loved by the community.</h2>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {reviews.map((r, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="bg-[#131316] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col h-full hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 shadow-xl">
                                <div className="text-accent text-lg md:text-xl mb-4 tracking-widest">★★★★★</div>
                                <p className="text-sm md:text-base text-text-muted italic mb-6 md:mb-8 leading-relaxed">&quot;{r.text}&quot;</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr ${r.color}`}></div>
                                    <div>
                                        <h5 className="text-sm md:text-base font-bold text-white">{r.author}</h5>
                                        <span className="text-xs text-text-muted font-medium">{r.role}</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}