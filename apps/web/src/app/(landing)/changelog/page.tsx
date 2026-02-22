'use client';

import { useState, useEffect } from 'react';
import FadeIn from '@/components/FadeIn';
import { ReleasesService } from '@/services/releases.service';
import type { ReleaseResponse } from '@repo/types';

export default function Changelog() {
    const [releases, setReleases] = useState<ReleaseResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const response = await ReleasesService.getAll();
                if (response.success) {
                    setReleases(response.data);
                } else {
                    setError('Failed to load version history.');
                }
            } catch (err) {
                setError('A network error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReleases();
    }, []);

    // Функція для форматування дати
    const formatDate = (dateInput: string | Date) => {
        return new Date(dateInput).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <FadeIn>
                    <div className="mb-12 md:mb-20 text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-6">
                            System Logs
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Changelog</h1>
                        <p className="text-text-muted text-base md:text-lg">
                            Tracking continuous improvements to the QwikTwik engine.
                        </p>
                    </div>
                </FadeIn>

                <div className="relative  border-white/5 ml-3 md:ml-0 md:pl-8">
                    {isLoading ? (
                        // Скелетон або лоадер під час завантаження
                        <div className="flex flex-col items-center py-20">
                            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-text-muted animate-pulse">Fetching engine logs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-500/5 border border-red-500/20 rounded-3xl">
                            <p className="text-red-400 font-bold">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 text-xs underline text-text-muted hover:text-white"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        releases.map((update, index) => {
                            // Розбиваємо рядок changelog на масив рядків для рендерингу списком
                            const changes = update.changelog
                                ? update.changelog.split('\n').filter(line => line.trim() !== '')
                                : ['No details provided for this release.'];

                            return (
                                <FadeIn key={update.id} delay={index * 0.1}>
                                    <div className="mb-12 relative pl-6 md:pl-0">
                                        <div className="absolute w-4 h-4 bg-[#050505] border-2 border-accent rounded-full -left-[35px] md:-left-[41px] top-1"></div>

                                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                                            <h2 className="text-2xl font-black font-mono text-white">{update.version}</h2>
                                            <div className="flex items-center gap-3">
                                                <span className="text-text-muted text-sm">{formatDate(update.createdAt)}</span>
                                                <span className="px-2 py-0.5 bg-white/5 text-white/70 text-[10px] uppercase tracking-wider rounded font-bold">
                                                    Stable Release
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-[#131316] border border-white/5 rounded-2xl p-6 md:p-8">
                                            <ul className="space-y-3">
                                                {changes.map((change, i) => (
                                                    <li key={i} className="flex items-start text-sm md:text-base text-text-muted">
                                                        <span className="text-accent mr-3 mt-0.5">➔</span>
                                                        <span className="leading-relaxed">{change.replace(/^[*-]\s*/, '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })
                    )}

                    {!isLoading && releases.length === 0 && !error && (
                        <div className="text-center py-20">
                            <p className="text-text-muted italic">No releases found in the database.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}