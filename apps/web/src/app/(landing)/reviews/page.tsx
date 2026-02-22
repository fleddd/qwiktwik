'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PAGES } from '@/constants/pages';
import type { ReviewResponse } from '@repo/types';
import { ReviewService } from '@/services/reviews.service';

const Stars = ({ count }: { count: number }) => (
    <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < count ? 'fill-[#00FF66] text-[#00FF66]' : 'fill-white/10 text-white/10'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

export default function ReviewsPage() {
    const [filter, setFilter] = useState<'all' | 'PRO' | 'FREE'>('all');
    const [visibleCount, setVisibleCount] = useState(6);

    // Стейт для збереження реальних даних з бекенду
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await ReviewService.getPublicReviews();
            if (res.success) {
                setReviews(res.data);
            }
            setIsLoading(false);
        };
        fetchReviews();
    }, []);

    // Фільтруємо по плану (PRO або FREE)
    const filteredReviews = reviews.filter(review =>
        filter === 'all' || review.user.subscription?.plan === filter
    );
    const visibleReviews = filteredReviews.slice(0, visibleCount);

    const handleFilterChange = (newFilter: 'all' | 'PRO' | 'FREE') => {
        setFilter(newFilter);
        setVisibleCount(6);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 relative overflow-hidden">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00FF66] blur-[200px] rounded-full opacity-[0.03] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mt-12 mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                    >
                        Wall of <span className="text-[#00FF66]">Performance</span>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-[#94a3b8] text-lg max-w-2xl mb-8"
                    >
                        Read what competitive gamers and streamers have to say about QwikTwik.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Link href="/dashboard/reviews" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all text-sm">
                            Write a Review
                        </Link>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 py-6 border-y border-white/5">
                    <div className="text-sm text-[#94a3b8]">
                        Showing <strong className="text-white">{filteredReviews.length}</strong> reviews
                    </div>

                    <div className="flex bg-[#131316] p-1.5 rounded-xl border border-white/5">
                        <button onClick={() => handleFilterChange('all')} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>All</button>
                        <button onClick={() => handleFilterChange('PRO')} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'PRO' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>Pro</button>
                        <button onClick={() => handleFilterChange('FREE')} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'FREE' ? 'bg-white/10 text-white' : 'text-[#94a3b8] hover:text-white hover:bg-white/5'}`}>Free</button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-[#94a3b8] py-20">Loading reviews...</div>
                ) : (
                    <>
                        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {visibleReviews.map((review) => (
                                    <motion.div
                                        key={review.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                                        className="break-inside-avoid bg-[#131316] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                                    >
                                        <div className="mb-4"><Stars count={review.rating} /></div>
                                        <p className="text-[#e2e8f0] leading-relaxed text-sm mb-6">"{review.text}"</p>
                                        <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-white overflow-hidden">
                                                    {review.user.avatar ? <img src={review.user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : review.user.name?.charAt(0) || 'G'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-white">{review.user.name || 'Ghost Player'}</div>
                                                    <div className="text-xs text-[#94a3b8]">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            {review.user.subscription?.plan === 'PRO' ? (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00FF66]/10 border border-[#00FF66]/20 rounded-md">
                                                    <span className="text-[10px] font-black text-[#00FF66] uppercase tracking-wider">Pro</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center px-2.5 py-1 bg-white/5 border border-white/10 rounded-md">
                                                    <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Free</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredReviews.length > visibleCount && (
                            <div className="mt-12 flex justify-center">
                                <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-8 py-4 bg-[#131316] hover:bg-white/5 border border-white/10 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}