import { ReleasesService } from '@/services/releases.service';
import DownloadsClient from './DownloadsClient';

export default async function DownloadsPage() {
    // Стягуємо ВСІ релізи з бекенду
    const response = await ReleasesService.getAll();

    // Якщо сталася помилка або релізів ще немає
    if (!response.success || !response.data || response.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <h2 className="text-2xl font-black mb-2 uppercase">No releases found</h2>
                <p className="text-text-muted mb-6">The software is currently being prepared for distribution.</p>
                <a href="/dashboard" className="text-accent underline text-sm">Back to Dashboard</a>
            </div>
        );
    }

    // Передаємо масив релізів у клієнтський компонент
    return <DownloadsClient releases={response.data} />;
}