'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AdminService } from '@/services/user.service';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // State для модалки
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Дані форми в модалці
    const [editForm, setEditForm] = useState({ role: 'USER', plan: 'FREE' });

    // 1. Завантаження користувачів
    const fetchUsers = async () => {
        setIsLoading(true);
        const res = await AdminService.getAllUsers();
        if (res.success && res.data) {
            setUsers(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Фільтрація
    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 3. Відкриття модалки
    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditForm({
            role: user.role,
            plan: user.subscription?.plan || 'FREE'
        });
        setIsModalOpen(true);
    };

    // 4. Збереження змін
    const handleSave = async () => {
        if (!editingUser) return;
        setIsUpdating(true);

        const res = await AdminService.updateUser(editingUser.id, editForm);

        if (res.success) {
            // Оновлюємо локальний стейт без перезавантаження сторінки
            setUsers(users.map(u => {
                if (u.id === editingUser.id) {
                    return {
                        ...u,
                        role: editForm.role,
                        subscription: { ...u.subscription, plan: editForm.plan }
                    };
                }
                return u;
            }));
            setIsModalOpen(false);
        } else {
            alert('Failed to update user: ' + res.error?.message);
        }
        setIsUpdating(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight uppercase">Manage Users</h1>
                    <p className="text-text-muted text-sm">View and edit user accounts.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email or name..."
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
                                    <th className="px-6 py-4 font-bold">Plan</th>
                                    <th className="px-6 py-4 font-bold">Role</th>
                                    <th className="px-6 py-4 font-bold">Joined</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                            No users found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white">{user.name || 'Unnamed'}</p>
                                                <p className="text-xs text-text-muted">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${user.subscription?.plan === 'PRO' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-white/10 text-white/70'}`}>
                                                    {user.subscription?.plan || 'FREE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold ${user.role === 'ADMIN' ? 'text-red-400' : 'text-text-muted'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="text-xs font-bold text-[#00FF66] hover:underline cursor-pointer"
                                                >
                                                    Edit
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

            {/* SHADCN MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-[#131316] border border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">Edit User Access</DialogTitle>
                        <p className="text-sm text-text-muted mt-1">
                            Editing details for <span className="text-white font-bold">{editingUser?.email}</span>
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        {/* Вибір Ролі */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">System Role</label>
                            <select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF66]/50"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {/* Вибір Плану */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Subscription Plan</label>
                            <select
                                value={editForm.plan}
                                onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                className="bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF66]/50"
                            >
                                <option value="FREE">Free Plan</option>
                                <option value="PRO">Pro Plan</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-end gap-2 mt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="px-6 py-2.5 bg-[#00FF66] text-black rounded-xl text-sm font-black hover:bg-[#00d957] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}