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
        displayReviews = shuffled.slice(0, 3);
    }

    if (displayReviews.length === 0) {
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
        ];
    }

    // Градієнти для аватарок, якщо юзер не має власної картинки
    const gradients = [
        'from-[#00FF66] to-[#0f0f11]',
        'from-[#7c3aed] to-[#0f0f11]',
        'from-[#ef4444] to-[#0f0f11]'
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10 md:mb-16 tracking-tight">Loved by the community.</h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {displayReviews.map((review, i) => (
                        <FadeIn key={review.id} delay={i * 0.1}>
                            <div className="bg-[#131316] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col h-full hover:border-white/15 hover:bg-white/[0.03] transition-all duration-300 shadow-xl">

                                {/* Зірочки */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <svg
                                            key={starIdx}
                                            className={`w-5 h-5 ${starIdx < review.rating ? 'fill-[#00FF66] text-[#00FF66]' : 'fill-white/10 text-transparent'}`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Текст */}
                                <p className="text-sm md:text-base text-text-muted italic mb-6 md:mb-8 leading-relaxed">
                                    &quot;{review.text}&quot;
                                </p>

                                {/* Юзер */}
                                <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                                    <div className="flex items-center gap-3">
                                        {/* Аватарка (картинка або градієнтна буква) */}
                                        {review.user?.avatar ? (
                                            <img
                                                src={review.user.avatar}
                                                alt="Avatar"
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr ${gradients[i % 3]} flex items-center justify-center font-black text-white border border-white/5`}>
                                                {review.user?.name?.charAt(0).toUpperCase() || 'G'}
                                            </div>
                                        )}

                                        <div>
                                            <h5 className="text-sm md:text-base font-bold text-white">
                                                {review.user?.name || 'Ghost Player'}
                                            </h5>
                                            <span className="text-xs text-text-muted font-medium">
                                                {review.user?.subscription?.plan === 'PRO' ? 'Pro Member' : 'Free User'}
                                            </span>
                                        </div>
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