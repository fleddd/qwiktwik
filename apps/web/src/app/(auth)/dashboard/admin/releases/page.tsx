'use client';

import { useState, useEffect } from 'react';
import { AdminReleasesService } from '@/services/releases.service'; // Перевір шлях
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function AdminReleasesPage() {
    const [releases, setReleases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Стейт для модалки Створення/Редагування
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        version: '',
        downloadUrl: '',
        changelog: '',
        isActive: true,
    });
    const [isSaving, setIsSaving] = useState(false);

    // Стейт для модалки Видалення
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [releaseToDelete, setReleaseToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchReleases = async () => {
        setIsLoading(true);
        const res = await AdminReleasesService.getAll();
        if (res.success && res.data) {
            setReleases(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReleases();
    }, []);

    // --- ОБРОБНИКИ ФОРМИ ---
    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({ version: '', downloadUrl: '', changelog: '', isActive: true });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (release: any) => {
        setEditingId(release.id);
        setFormData({
            version: release.version,
            downloadUrl: release.downloadUrl,
            changelog: release.changelog || '',
            isActive: release.isActive,
        });
        setIsFormModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        let res;

        if (editingId) {
            res = await AdminReleasesService.update(editingId, formData);
        } else {
            res = await AdminReleasesService.create(formData);
        }

        if (res.success) {
            setIsFormModalOpen(false);
            fetchReleases(); // Оновлюємо список
        } else {
            alert(res.error?.message || 'Failed to save release');
        }
        setIsSaving(false);
    };

    // --- ОБРОБНИКИ ВИДАЛЕННЯ ---
    const handleOpenDelete = (id: string) => {
        setReleaseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!releaseToDelete) return;
        setIsDeleting(true);
        const res = await AdminReleasesService.delete(releaseToDelete);

        if (res.success) {
            setReleases(releases.filter(r => r.id !== releaseToDelete));
            setIsDeleteModalOpen(false);
            setReleaseToDelete(null);
        } else {
            alert('Failed to delete release');
        }
        setIsDeleting(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">System Releases</h1>
                    <p className="text-text-muted text-sm">Manage desktop client versions.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="cursor-pointer px-6 py-3 bg-[#00FF66] text-black font-black rounded-xl hover:bg-[#00FF66]/80 transition-all text-sm uppercase"
                >
                    + Create Release
                </button>
            </header>

            <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden min-h-[300px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-widest text-text-muted">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Version</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">Release Date</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {releases.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-text-muted">No releases found.</td>
                                    </tr>
                                ) : (
                                    releases.map((release) => (
                                        <tr key={release.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-white">v{release.version}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${release.isActive ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-red-500/10 text-red-400'}`}>
                                                    {release.isActive ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {new Date(release.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenEdit(release)}
                                                    className="cursor-pointer text-xs font-bold text-white/50 hover:text-white mr-4 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(release.id)}
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

            {/* МОДАЛКА СТВОРЕННЯ / РЕДАГУВАННЯ */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                <DialogContent className="bg-[#131316] border border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingId ? 'Edit Release' : 'New Release'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Version (e.g., 1.0.0)</label>
                            <input
                                type="text"
                                value={formData.version}
                                onChange={e => setFormData({ ...formData, version: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF66]/50"
                                placeholder="1.0.0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Download URL (.exe)</label>
                            <input
                                type="text"
                                value={formData.downloadUrl}
                                onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF66]/50"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Changelog</label>
                            <textarea
                                value={formData.changelog}
                                onChange={e => setFormData({ ...formData, changelog: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF66]/50 min-h-[100px]"
                                placeholder="- Added new feature&#10;- Fixed bugs"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 accent-[#00FF66]"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-white cursor-pointer">
                                Make this release active (visible to users)
                            </label>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end gap-2">
                        <button onClick={() => setIsFormModalOpen(false)} className="cursor-pointer px-4 py-2 text-sm font-bold text-white/50 hover:text-white">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.version || !formData.downloadUrl}
                            className="cursor-pointer px-6 py-2 bg-[#00FF66] text-black rounded-xl text-sm font-black disabled:opacity-50 hover:bg-[#00FF66]/80"
                        >
                            {isSaving ? 'Saving...' : 'Save Release'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* МОДАЛКА ВИДАЛЕННЯ */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="bg-[#131316] border border-red-500/20 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase text-red-400">Delete Release?</DialogTitle>
                        <p className="text-sm text-text-muted mt-2">
                            This action cannot be undone. Users on this version might not be able to auto-update if you delete it.
                        </p>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2 mt-6">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="cursor-pointer px-6 py-2.5 text-sm font-bold text-white/50 hover:text-white">
                            Cancel
                        </button>
                        <button
                            onClick={executeDelete}
                            disabled={isDeleting}
                            className="cursor-pointer px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-black disabled:opacity-50 hover:bg-red-500/20"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}