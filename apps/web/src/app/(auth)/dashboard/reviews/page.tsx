'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateReviewSchema } from '@repo/validation';
import { ReviewService } from '@/services/reviews.service';
import type { MyReview } from '@/services/reviews.service';

const Stars = ({ count }: { count: number }) => (
    <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-8 h-8 md:w-10 md:h-10 ${star <= count ? 'fill-[#00FF66] text-[#00FF66] drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]' : 'fill-white/5 text-white/10'}`}
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const ErrorMessage = ({ error }: { error: any }) => {
    if (!error) return null;
    const message = typeof error === 'object' && error.message ? error.message : String(error);
    const details = typeof error === 'object' && error.details ? error.details : null;

    return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
                <h4 className="text-red-400 text-sm font-bold">{message}</h4>
                {details && <p className="text-red-400/70 text-xs mt-1 font-mono">{details}</p>}
            </div>
        </div>
    );
};

export default function WriteReviewPage() {
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    // Явно вказуємо null як початковий стан
    const [existingReview, setExistingReview] = useState<MyReview | null>(null);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [initialFetchError, setInitialFetchError] = useState<any>(null);
    const [formError, setFormError] = useState<any>(null);

    const MAX_CHARS = 500;

    useEffect(() => {
        const fetchMyReview = async () => {
            setInitialFetchError(null);
            try {
                const res = await ReviewService.getMyReview();

                if (res.success) {
                    // 1. Якщо прийшов null або пустий масив [] -> показуємо форму
                    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
                        setExistingReview(null);
                    }
                    // 2. Якщо бекенд чомусь повернув масив з відгуком -> беремо перший елемент
                    else if (Array.isArray(res.data) && res.data.length > 0) {
                        setExistingReview(res.data[0]);
                    }
                    // 3. Ідеальний сценарій: прийшов один об'єкт відгуку
                    else {
                        setExistingReview(res.data);
                    }
                } else {
                    setInitialFetchError(res.error);
                }
            } catch (error) {
                setInitialFetchError('Failed to connect to the server.');
            } finally {
                setIsLoadingInitial(false);
            }
        };
        fetchMyReview();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const validationResult = CreateReviewSchema.safeParse({ rating, text: reviewText });
        if (!validationResult.success) {
            setFormError(validationResult.error.errors[0].message);
            return;
        }

        setIsSubmitting(true);
        const response = await ReviewService.submitReview(validationResult.data);
        setIsSubmitting(false);

        if (response.success) {
            setExistingReview({
                id: response.data?.id || 'new',
                rating: validationResult.data.rating,
                text: validationResult.data.text,
                createdAt: new Date().toISOString()
            });
            setRating(0);
            setReviewText('');
        } else {
            setFormError(response.error);
        }
    };

    const handleDelete = async () => {
        setFormError(null);
        setIsDeleting(true);

        const res = await ReviewService.deleteReview();
        setIsDeleting(false);

        if (res.success) {
            setExistingReview(null);
        } else {
            setFormError(res.error);
        }
    };

    if (isLoadingInitial) {
        return (
            <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-[calc(100vh-6rem)] relative">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[300px] bg-[#00FF66] blur-[200px] rounded-full opacity-[0.03] pointer-events-none -z-10" />

            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight uppercase">
                    {existingReview ? 'Your ' : 'Share your '}
                    <span className="text-[#00FF66]">Experience</span>
                </h1>
                <p className="text-text-muted text-sm md:text-base">
                    {existingReview
                        ? 'Thank you for your feedback! Here is what you shared with the community.'
                        : 'How much FPS did you gain? Did your input lag drop?'}
                </p>
            </header>

            {initialFetchError && !existingReview && (
                <div className="mb-6">
                    <ErrorMessage error={initialFetchError} />
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* Чітка умова: показуємо відгук ТІЛЬКИ якщо об'єкт existingReview існує */}
                {existingReview ? (
                    <motion.div
                        key="view-review"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="bg-[#131316] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex-1 flex flex-col"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66] blur-[100px] opacity-[0.05] pointer-events-none" />

                        <div className="relative z-10 flex flex-col flex-1">
                            {formError && <div className="mb-5"><ErrorMessage error={formError} /></div>}

                            <div className="mb-8">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 block">Rating</span>
                                <Stars count={existingReview.rating} />
                            </div>

                            <div className="mb-8 flex-1 flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 block">Review</span>
                                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/5 overflow-y-auto">
                                    <p className="text-base text-white font-medium leading-relaxed italic">
                                        "{existingReview.text}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-white/5 pt-6 mt-auto">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="cursor-pointer px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold rounded-xl transition-all text-sm flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete & Write New
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // Якщо existingReview === null, показуємо форму
                    !initialFetchError && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="bg-[#131316] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex-1 flex flex-col"
                        >
                            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8 flex-1">

                                {formError && <ErrorMessage error={formError} />}

                                <div>
                                    <label className="block text-xs font-bold text-white mb-3 uppercase tracking-widest">
                                        Overall Rating <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star} type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <svg
                                                    className={`w-10 h-10 transition-colors duration-200 ${star <= (hoverRating || rating)
                                                        ? 'fill-[#00FF66] text-[#00FF66] drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                                                        : 'fill-white/5 text-white/20 hover:text-white/40'
                                                        }`}
                                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col relative">
                                    <div className="flex justify-between items-end mb-3">
                                        <label htmlFor="review" className="block text-xs font-bold text-white uppercase tracking-widest">
                                            Your Review <span className="text-red-500">*</span>
                                        </label>
                                        <span className={`text-xs font-mono ${reviewText.length > MAX_CHARS ? 'text-red-400' : 'text-[#94a3b8]'}`}>
                                            {reviewText.length} / {MAX_CHARS}
                                        </span>
                                    </div>
                                    <div className="relative flex-1 flex flex-col">
                                        <textarea
                                            id="review"
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="I installed QwikTwik and my FPS went from..."
                                            className="w-full flex-1 min-h-[200px] bg-[#0a0a0c] border border-white/10 rounded-2xl p-5 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF66]/50 focus:ring-1 focus:ring-[#00FF66]/50 transition-all resize-none font-medium leading-relaxed"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${reviewText.length > MAX_CHARS ? 'bg-red-500' : 'bg-[#00FF66]'}`}
                                                style={{ width: `${Math.min((reviewText.length / MAX_CHARS) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-end mt-auto">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`
                                            cursor-pointer
                                            flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-sm transition-all
                                            ${isSubmitting ? 'bg-white/5 text-white/30' : 'bg-[#00FF66] text-black hover:bg-[#00d957] active:scale-95'}
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
}