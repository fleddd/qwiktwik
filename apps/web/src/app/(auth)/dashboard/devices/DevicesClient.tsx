'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DevicesService } from '@/services/devices.service';
import type { DeviceResponse } from '@repo/types';

export default function DevicesClient({ initialDevices }: { initialDevices: DeviceResponse[] }) {
    const [devices, setDevices] = useState(initialDevices);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleUnlink = async (deviceId: string) => {
        if (!confirm('Are you sure you want to unlink this device?')) return;

        setLoadingId(deviceId);
        const res = await DevicesService.unlinkDevice(deviceId);

        if (res.success) {
            setDevices(devices.filter(d => d.id !== deviceId));
            router.refresh(); // Оновлюємо серверний стейт
        } else {
            alert(res.error?.message || 'Error occured while processing.');
        }
        setLoadingId(null);
    };

    if (devices.length === 0) {
        return (
            <div className="bg-[#131316] border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">There are no devices linked.</h3>
                <p className="text-text-muted text-sm max-w-md">
                    Download QwikTwik, log into your account, and your PC automatically appears here. (HWID Binding).
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
                <div key={device.id} className="bg-[#131316] border border-white/5 p-6 rounded-2xl flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white">{device.name || 'Unknown Desktop'}</h3>
                            <p className="text-text-muted text-xs font-mono mt-1">HWID: {device.hwid}</p>
                        </div>
                        <span className="bg-accent/10 text-accent text-[10px] font-black uppercase px-3 py-1 rounded-full">
                            Active
                        </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <p className="text-text-muted text-xs">
                            Last seen: {new Date(device.lastSeen).toLocaleDateString()}
                        </p>
                        <button
                            onClick={() => handleUnlink(device.id)}
                            disabled={loadingId === device.id}
                            className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {loadingId === device.id ? 'Unlinking...' : 'Unlink Device'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}