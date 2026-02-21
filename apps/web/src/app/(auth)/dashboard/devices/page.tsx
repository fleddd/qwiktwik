import { DevicesService } from '@/services/devices.service';
import DevicesClient from './DevicesClient';

export default async function DevicesPage() {
    // Серверний фетч пристроїв
    const response = await DevicesService.getDevices();
    const devices = response.success ? response.data : [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight">Hardware Bindings</h1>
                <p className="text-text-muted text-sm">
                    Керуйте комп'ютерами, які мають доступ до вашої ліцензії Jarvis.
                </p>
            </header>

            {/* Передаємо дані в клієнтський компонент для інтерактивності */}
            <DevicesClient initialDevices={devices} />
        </div>
    );
}