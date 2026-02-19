'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PAGES } from '../constants/pages';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white px-6 overflow-hidden relative">

                {/* Фонове червоне світіння для тривоги */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500 blur-[200px] rounded-full opacity-[0.03] pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Великий код помилки з глітч-ефектом */}
                        <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-white/5 relative inline-block">
                            404
                            <span className="absolute inset-0 text-accent opacity-20 animate-pulse">404</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-[-20px] md:mt-[-40px]"
                    >
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest mb-4">
                            Resource <span className="text-red-500 underline decoration-red-500/30">Terminated</span>
                        </h2>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 max-w-md mx-auto font-mono text-xs md:text-sm text-text-muted leading-relaxed">
                            <div className="flex items-center gap-2 mb-2 text-red-400">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                CRITICAL_PATH_NOT_FOUND
                            </div>
                            <p>
                                The page you are looking for has been accidentally debloated or its resource policy set was nullified. Kernel tweaks failed to resolve the address.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={PAGES.HOME}
                                className="px-8 py-4 bg-accent text-black font-black rounded-xl shadow-glow hover:bg-accent-hover hover:-translate-y-1 transition-all text-sm uppercase tracking-widest"
                            >
                                Return to System
                            </Link>
                            <Link
                                href={PAGES.DOCS}
                                className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                            >
                                View Knowledge Base
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Декоративний термінальний рядок знизу */}
                <div className="absolute bottom-10 left-10 hidden lg:block font-mono text-[10px] text-text-muted/30 uppercase tracking-[0.3em]">
                    Interrupt Steering: Failure // Memory Leak Detected: False //
                </div>
            </main>
            <Footer />
        </>
    );
}