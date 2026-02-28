import { ReviewService } from '@/services/reviews.service';
import FadeIn from './FadeIn';
import type { ReviewResponse } from '@repo/types';

export default async function Testimonials() {
    // 1. Отримуємо відгуки з бекенду (кешується Next.js)
    const response = await ReviewService.getPublicReviews();

    let displayReviews: ReviewResponse[] = [];

    if (response.success && response.data.length > 0) {
        const topReviews = response.data.filter((r) => r.rating >= 4);
        const shuffled = topReviews.sort(() => 0.5 - Math.random());
        // Беремо трохи більше відгуків для гарної каруселі (наприклад, 6)
        displayReviews = shuffled.slice(0, 6);
    }

    if (displayReviews.length < 3) {
        displayReviews = [
            {
                id: 'fallback-1',
                text: "QwikTwik literally fixed my micro-stutters in CS2. The real-time switching is magic. I don't even have to think about it anymore.",
                rating: 5,
                user: { name: 'Alex "Viper" M.', avatar: null, subscription: { plan: 'PRO' } }
            } as any,
            {
                id: 'fallback-2',
                text: "I stream Warzone and used to drop frames heavily. The Streaming Mode somehow balanced my CPU perfectly. Highly recommended!",
                rating: 5,
                user: { name: 'Sarah T.', avatar: null, subscription: { plan: 'FREE' } }
            } as any,
            {
                id: 'fallback-3',
                text: "The bloatware removal alone is worth installing this. My idle RAM usage dropped from 4GB to 1.8GB instantly.",
                rating: 4,
                user: { name: 'David K.', avatar: null, subscription: { plan: 'PRO' } }
            } as any,
            // Додаємо ще кілька фолбеків для нескінченної прокрутки, якщо БД порожня
            {
                id: 'fallback-4',
                text: "Ping dropped by 15ms on European servers. The Network Adapter Tuner is actually doing something under the hood.",
                rating: 5,
                user: { name: 'Markus', avatar: null, subscription: { plan: 'PRO' } }
            } as any,
        ];
    }

    // Градієнти для аватарок, якщо юзер не має власної картинки
    const gradients = [
        'from-[#00FF66] to-[#0f0f11]',
        'from-[#7c3aed] to-[#0f0f11]',
        'from-[#ef4444] to-[#0f0f11]',
        'from-[#3b82f6] to-[#0f0f11]'
    ];

    // Дублюємо масив для безперервного безкінечного скролу (Marquee ефект)
    const marqueeReviews = [...displayReviews, ...displayReviews];

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mb-12 md:mb-20">
                <FadeIn>
                    <div className="text-center">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                            Loved by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">community.</span>
                        </h2>
                        <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto">
                            Join thousands of gamers who have already unlocked their system&apos;s true potential.
                        </p>
                    </div>
                </FadeIn>
            </div>

            {/* --- БЕЗКІНЕЧНА КАРУСЕЛЬ (INFINITE MARQUEE) --- */}
            <div className="relative w-full overflow-hidden flex pb-4 z-10 group">
                <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

                {/* Трек, що рухається */}
                <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
                    {marqueeReviews.map((review, i) => (
                        <div
                            key={`${review.id}-${i}`}
                            className="w-[300px] md:w-[400px] shrink-0 mx-3 md:mx-4"
                        >
                            <div className="bg-charcoal border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col h-full hover:border-accent/30 transition-all duration-500 shadow-xl group/card relative overflow-hidden">

                                {/* Декоративний відблиск при наведенні */}
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                {/* Зірочки */}
                                <div className="flex items-center gap-1 mb-5 relative z-10">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <svg
                                            key={starIdx}
                                            className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${starIdx < review.rating ? 'fill-accent text-accent' : 'fill-white/5 text-transparent'}`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Текст */}
                                <p className="text-sm md:text-base text-white/80 italic mb-8 leading-relaxed flex-grow relative z-10">
                                    &quot;{review.text}&quot;
                                </p>

                                {/* Юзер */}
                                <div className="flex items-center gap-4 mt-auto pt-5 border-t border-white/5 relative z-10">
                                    {review.user?.avatar ? (
                                        <img
                                            src={review.user.avatar}
                                            alt="Avatar"
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/10"
                                        />
                                    ) : (
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr ${gradients[i % gradients.length]} flex items-center justify-center font-black text-white shadow-inner`}>
                                            {review.user?.name?.charAt(0).toUpperCase() || 'G'}
                                        </div>
                                    )}

                                    <div>
                                        <h5 className="text-sm font-bold text-white tracking-wide">
                                            {review.user?.name || 'Ghost Player'}
                                        </h5>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${review.user?.subscription?.plan === 'PRO' ? 'text-accent' : 'text-text-muted'}`}>
                                            {review.user?.subscription?.plan === 'PRO' ? 'Pro Member' : 'Free User'}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}