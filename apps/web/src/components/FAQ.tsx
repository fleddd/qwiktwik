import FadeIn from './FadeIn';

export default function FAQ() {
    const faqs = [
        {
            q: "Will this trigger Anti-Cheats (VAC, Vanguard)?",
            a: "Absolutely not. QwikTwik is 100% safe and operates on a system level (registry, services, and power plans). It does not inject code into games or modify game files, making it completely invisible to all anti-cheat engines including Vanguard, BattlEye, and Easy Anti-Cheat."
        },
        {
            q: "Do I need to reboot my PC after switching modes?",
            a: "No. Our proprietary engine applies registry and service state changes in real-time. You can switch from Balanced to Gaming mode while sitting in a game lobby, and the changes take effect instantly."
        },
        {
            q: "How does it actually reduce input lag?",
            a: "We apply precise adjustments to the system Timer Resolution and disable USB interrupt moderation and coalescing to ensure your mouse and keyboard clicks register with zero artificial delay."
        },
        {
            q: "What hardware-level optimizations are included?",
            a: "QwikTwik forces your GPU into its highest power state (P0 and D0) to prevent performance drops. We also optimize MSI (Message Signal Interrupts) and Interrupt Steering to balance the workload across your CPU cores more efficiently."
        },
        {
            q: "Can it really improve my network ping?",
            a: "Yes. By optimizing Quality of Service (QoS) priorities and stabilizing network adapter settings to reduce bufferbloat, we ensure your game packets are prioritized over background Windows traffic."
        },
        {
            q: "What kind of 'bloatware' does it remove?",
            a: "We surgically disable resource-heavy features like Microsoft Copilot, Xbox Apps, and MS Store background syncs. Our 'Debloat' protocol also clears SRUM data and useless system tracking tasks that cause micro-stutters."
        },
        {
            q: "Does it work on Windows 11?",
            a: "Yes! QwikTwik is fully optimized for Windows 10 (20H2+) and Windows 11. We continuously update our profiles to match the latest Windows kernel changes and security updates."
        }
    ];

    return (
        <section className="py-16 md:py-24 relative" id="faq">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 md:mb-16 tracking-tight">Frequently Asked Questions</h2>
                </FadeIn>
                <div className="space-y-3 md:space-y-4">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <details className="group bg-[#131316] border border-white/5 rounded-xl overflow-hidden open:border-accent/30 transition-colors duration-300" {...(i === 0 ? { open: true } : {})}>
                                <summary className="p-5 md:p-6 text-base md:text-lg font-bold cursor-pointer list-none flex justify-between items-center outline-none text-white group-hover:text-accent transition-colors select-none">
                                    <span className="pr-4">{faq.q}</span>
                                    <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/10 transition-colors">
                                        <span className="absolute w-3 h-[2px] bg-accent group-open:bg-accent/50 transition-colors"></span>
                                        <span className="absolute w-[2px] h-3 bg-accent group-open:rotate-90 group-open:bg-transparent transition-all duration-300"></span>
                                    </div>
                                </summary>
                                <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-text-muted leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}