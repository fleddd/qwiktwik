'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateReviewSchema } from '@repo/validation';
import { ReviewService } from '@/services/reviews.service';

export default function WriteReviewPage() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const MAX_CHARS = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Клієнтська валідація через спільну схему Zod
        const validationResult = CreateReviewSchema.safeParse({
            rating,
            text: reviewText
        });

        if (!validationResult.success) {
            setError(validationResult.error.errors[0].message);
            return;
        }

        setIsSubmitting(true);

        // 2. Відправка на бекенд
        const response = await ReviewService.submitReview(validationResult.data);

        setIsSubmitting(false);

        if (response.success) {
            setIsSuccess(true);
        } else {
            setError(response.error.message || 'Something went wrong.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full pt-4 md:pt-10 pb-20 relative">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00FF66] blur-[180px] rounded-full opacity-[0.03] pointer-events-none -z-10" />

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">Share your <span className="text-[#00FF66]">Experience</span></h1>
                <p className="text-[#94a3b8] text-sm md:text-base">
                    How much FPS did you gain? Did your input lag drop? Tell the community.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#131316] border border-[#00FF66]/30 rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(0,255,102,0.1)]"
                    >
                        <div className="w-20 h-20 bg-[#00FF66]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-[#00FF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Review Submitted!</h2>
                        <p className="text-[#94a3b8] mb-8">Thank you for your feedback.</p>
                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setRating(0);
                                setReviewText('');
                            }}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
                        >
                            Update your review
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#131316] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-white mb-4 uppercase tracking-widest">
                                    Overall Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <svg
                                                className={`w-10 h-10 transition-colors duration-200 ${star <= (hoverRating || rating)
                                                    ? 'fill-[#00FF66] text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]'
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

                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label htmlFor="review" className="block text-sm font-bold text-white uppercase tracking-widest">
                                        Your Review <span className="text-red-500">*</span>
                                    </label>
                                    <span className={`text-xs font-mono ${reviewText.length > MAX_CHARS ? 'text-red-400' : 'text-[#94a3b8]'}`}>
                                        {reviewText.length} / {MAX_CHARS}
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="review"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="I installed QwikTwik and my FPS went from..."
                                        className="w-full h-40 bg-[#0a0a0c] border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF66]/50 focus:ring-1 focus:ring-[#00FF66]/50 transition-all resize-none font-medium leading-relaxed"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${reviewText.length > MAX_CHARS ? 'bg-red-500' : 'bg-[#00FF66]'}`}
                                            style={{ width: `${Math.min((reviewText.length / MAX_CHARS) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-base transition-all
                                        ${isSubmitting ? 'bg-white/5 text-white/30' : 'bg-[#00FF66] text-black hover:bg-[#00d957] active:scale-95'}
                                    `}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}