'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
    const router = useRouter();

    // Розпаковуємо Promise за допомогою React.use()
    const resolvedParams = use(params);
    const code = resolvedParams.code;

    useEffect(() => {
        if (code) {
            // Зберігаємо код для сторінки реєстрації
            localStorage.setItem('referralCode', code.toUpperCase());

            // Робимо красиву затримку для UX, щоб юзер побачив "Applying bonus"
            const timer = setTimeout(() => {
                router.push('/'); // Переконайся, що тут правильний шлях до твоєї сторінки реєстрації (може бути /register)
            }, 1500);

            return () => clearTimeout(timer);
        } else {
            router.push('/');
        }
    }, [code, router]);

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Декоративний фон */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent blur-[200px] rounded-full opacity-[0.05] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Спіннер */}
                <div className="w-16 h-16 border-4 border-white/10 border-t-accent rounded-full animate-spin mb-8"></div>

                <h1 className="text-2xl md:text-4xl font-black mb-3 text-white tracking-tight uppercase">
                    Activating Bonus
                </h1>

                <p className="text-text-muted text-sm md:text-base">
                    Applying partner code <span className="text-accent font-bold px-2 py-1 bg-accent/10 rounded-md uppercase tracking-widest">{code}</span>
                </p>
                <p className="text-white/40 text-xs mt-8 font-mono">
                    Redirecting to registration...
                </p>
            </div>
        </main>
    );
}