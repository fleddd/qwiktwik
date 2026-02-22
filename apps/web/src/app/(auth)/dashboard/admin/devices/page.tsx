'use client';

import { useState, useEffect } from 'react';
import { AdminDevicesService } from '@/services/devices.service'; // Перевір шлях
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function AdminHardwarePage() {
    const [devices, setDevices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Стейт для модалки скидання HWID
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [deviceToReset, setDeviceToReset] = useState<any | null>(null);
    const [isResetting, setIsResetting] = useState(false);

    // 1. Завантаження даних
    const fetchDevices = async () => {
        setIsLoading(true);
        const res = await AdminDevicesService.getAll();
        if (res.success && res.data) {
            setDevices(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    // 2. Фільтрація (Пошук по email, hwid або назві ПК)
    const filteredDevices = devices.filter(d =>
        d.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.hwid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 3. Відкриття модалки
    const handleOpenReset = (device: any) => {
        setDeviceToReset(device);
        setIsResetModalOpen(true);
    };

    // 4. Логіка видалення
    const executeReset = async () => {
        if (!deviceToReset) return;
        setIsResetting(true);

        const res = await AdminDevicesService.resetHwid(deviceToReset.id);

        if (res.success) {
            setDevices(devices.filter(d => d.id !== deviceToReset.id));
            setIsResetModalOpen(false);
            setDeviceToReset(null);
        } else {
            alert(res.error?.message || 'Failed to reset HWID');
        }
        setIsResetting(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Hardware Control</h1>
                    <p className="text-text-muted text-sm">Manage user HWID binds and device limits.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search HWID or email..."
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
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-widest text-text-muted">
                                <tr>
                                    <th className="px-6 py-4 font-bold">User</th>
                                    <th className="px-6 py-4 font-bold">PC Name</th>
                                    <th className="px-6 py-4 font-bold">HWID</th>
                                    <th className="px-6 py-4 font-bold">Last Seen</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredDevices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                            No devices found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDevices.map((device) => (
                                        <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white">{device.user?.email || 'Unknown User'}</p>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">{device.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-text-muted">{device.hwid}</td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {new Date(device.lastSeen).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenReset(device)}
                                                    className="text-xs font-bold px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                                                >
                                                    Reset HWID
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

            {/* МОДАЛКА ПІДТВЕРДЖЕННЯ СКИНУТТЯ HWID */}
            <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
                <DialogContent className="bg-[#131316] border border-red-500/20 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-red-400">Reset Hardware Bind?</DialogTitle>
                        <p className="text-sm text-text-muted mt-2">
                            This will unlink the HWID <strong className="text-white">{deviceToReset?.hwid}</strong> from user <strong className="text-white">{deviceToReset?.user?.email}</strong>.
                        </p>
                        <p className="text-sm text-text-muted mt-1">
                            The user will be able to bind a new PC on their next login.
                        </p>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-end gap-2 mt-6">
                        <button
                            onClick={() => setIsResetModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={executeReset}
                            disabled={isResetting}
                            className="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-black hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                            {isResetting ? 'Resetting...' : 'Yes, Reset HWID'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}