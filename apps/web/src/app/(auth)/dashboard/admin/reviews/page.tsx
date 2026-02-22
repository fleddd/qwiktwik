'use client';

import { useState, useEffect } from 'react';
import { AdminReviewsService } from '@/services/reviews.service';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Стейт для модалки "Перегляд відгуку"
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    // Стейт для модалки "Видалення"
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Завантаження відгуків
    const fetchReviews = async () => {
        setIsLoading(true);
        const res = await AdminReviewsService.getAllReviews();
        if (res.success && res.data) {
            setReviews(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // 2. Фільтрація (Пошук по email або тексту відгуку)
    const filteredReviews = reviews.filter(r =>
        r.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 3. Відкриття деталей
    const handleView = (review: any) => {
        setSelectedReview(review);
        setIsViewModalOpen(true);
    };

    // 4. Логіка видалення
    const confirmDelete = (id: string) => {
        setReviewToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!reviewToDelete) return;
        setIsDeleting(true);

        const res = await AdminReviewsService.deleteReview(reviewToDelete);

        if (res.success) {
            setReviews(reviews.filter(r => r.id !== reviewToDelete));
            setIsDeleteModalOpen(false);
            setReviewToDelete(null);
        } else {
            alert('Failed to delete review');
        }
        setIsDeleting(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Review Moderation</h1>
                    <p className="text-text-muted text-sm">Manage user testimonials and feedback.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email or text..."
                        className="w-full bg-[#131316] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF66]/50 transition-colors"
                    />
                </div>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
                                <tr>
                                    <th className="px-6 py-4 font-bold">User</th>
                                    <th className="px-6 py-4 font-bold">Rating</th>
                                    <th className="px-6 py-4 font-bold w-1/2">Review Text</th>
                                    <th className="px-6 py-4 font-bold whitespace-nowrap">Date</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                            No reviews found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-bold text-white">{review.user?.name || 'Unknown'}</p>
                                                <p className="text-xs text-text-muted">{review.user?.email}</p>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-accent">
                                                    <span className="font-black text-lg leading-none">{review.rating}</span>
                                                    <svg className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]" viewBox="0 0 24 24">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                </div>
                                            </td>

                                            <td
                                                className="px-6 py-4 text-text-muted italic max-w-[200px] md:max-w-md truncate cursor-pointer hover:text-white transition-colors"
                                                onClick={() => handleView(review)}
                                                title="Click to read full review"
                                            >
                                                "{review.text}"
                                            </td>

                                            <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleView(review)}
                                                    className="cursor-pointer text-xs font-bold text-white/50 hover:text-white mr-4 transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(review.id)}
                                                    className="cursor-pointer text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL 1: ПЕРЕГЛЯД ВІДГУКУ */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="bg-[#131316] border border-white/10 text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Review Details</DialogTitle>
                    </DialogHeader>
                    {selectedReview && (
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white">{selectedReview.user.name}</p>
                                    <p className="text-xs text-text-muted">{selectedReview.user.email}</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00FF66]/10 rounded-lg text-[#00FF66]">
                                    <span className="font-black">{selectedReview.rating}</span>
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl mt-2">
                                <p className="text-sm leading-relaxed text-white whitespace-pre-wrap font-medium italic">
                                    "{selectedReview.text}"
                                </p>
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                Submitted on: {new Date(selectedReview.createdAt).toLocaleString()}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 2: ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="bg-[#131316] border border-red-500/20 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-red-400">Delete Review?</DialogTitle>
                        <p className="text-sm text-text-muted mt-2">
                            This action cannot be undone. The review will be permanently removed from the public wall.
                        </p>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-end gap-2 mt-6">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={executeDelete}
                            disabled={isDeleting}
                            className="cursor-pointer px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-black hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}