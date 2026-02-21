import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const response = await AuthService.getProfile();

    if (!response.success) {
        redirect('/login');
    }

    const user = response.data;

    return (
        // Використовуємо звичайний min-h-screen. Ніяких жорстких обмежень висоти!
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">

            <Sidebar user={user} />

            {/* Контент просто розтягує сторінку вниз. Браузер сам обробить скрол */}
            <main className="flex-1 p-6 md:p-12 w-full max-w-[100vw]">
                {children}
            </main>

        </div>
    );
}