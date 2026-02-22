import { fetcher } from '@/lib/fetcher';
import type { DeviceResponse } from '@repo/types';

export const DevicesService = {
    // Отримати всі прив'язані ПК
    getDevices: async () => {
        return fetcher<DeviceResponse[]>('/devices', {
            method: 'GET',
        });
    },

    // Відв'язати ПК
    unlinkDevice: async (deviceId: string) => {
        return fetcher(`/devices/${deviceId}`, {
            method: 'DELETE',
        });
    },
};


export const AdminDevicesService = {
    getAll: async () => {
        return fetcher<any[]>('/devices/admin/all', {
            method: 'GET',
        });
    },

    resetHwid: async (id: string) => {
        return fetcher(`/devices/admin/${id}`, {
            method: 'DELETE',
        });
    }
};