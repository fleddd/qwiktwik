'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UsersService } from '@/services/user.service';
import type { UserProfileResponse } from '@repo/types';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FaDiscord, FaGoogle } from 'react-icons/fa';

export default function SettingsClient({ user }: { user: UserProfileResponse }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile States
    const [name, setName] = useState(user.name || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Password States
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Avatar States
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState({ type: '', text: '' });

    // OAuth States
    const [providerToDisconnect, setProviderToDisconnect] = useState<'google' | 'discord' | null>(null);

    const hasGoogle = user.oauthAccounts?.some(acc => acc.provider === 'google');
    const hasDiscord = user.oauthAccounts?.some(acc => acc.provider === 'discord');


    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage({ type: '', text: '' });

        const res = await UsersService.updateProfile({ name });

        if (res.success) {
            setProfileMessage({ type: 'success', text: 'Профіль успішно оновлено.' });
            router.refresh();
        } else {
            setProfileMessage({ type: 'error', text: res.error?.message || 'Помилка оновлення.' });
        }
        setIsSavingProfile(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwords.new !== passwords.confirm) {
            return setPasswordMessage({ type: 'error', text: 'Паролі не збігаються.' });
        }

        setIsSavingPassword(true);
        const res = await UsersService.updatePassword({
            current: passwords.current,
            new: passwords.new
        });

        if (res.success) {
            setPasswordMessage({ type: 'success', text: 'Пароль успішно змінено.' });
            setPasswords({ current: '', new: '', confirm: '' });
        } else {
            setPasswordMessage({ type: 'error', text: res.error?.message || 'Помилка оновлення.' });
        }
        setIsSavingPassword(false);
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setAvatarMessage({ type: 'error', text: 'Too large file (max 2MB)' });
            return;
        }

        setIsUploadingAvatar(true);
        setAvatarMessage({ type: '', text: '' });

        const reader = new FileReader();
        reader.onloadend = async () => {
            setAvatarPreview(reader.result as string);

            console.log('File to upload:', file instanceof File, file);
            const res = await UsersService.uploadAvatar(file);

            if (res.success && res.data?.avatarUrl) {
                setAvatarPreview(res.data.avatarUrl);
                router.refresh();
            } else {
                setAvatarMessage({ type: 'error', text: !res.success ? res.error.message : "Error while updating new avatar." });
                setAvatarPreview(user.avatar || null);
            }
            setIsUploadingAvatar(false);
        };
        reader.readAsDataURL(file);
    };

    const confirmDisconnect = async () => {
        if (!providerToDisconnect) return;

        const res = await UsersService.disconnectProvider(providerToDisconnect);
        router.refresh();
        setProviderToDisconnect(null);
    };

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-6xl">
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-[#131316] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Public Profile
                        </h3>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="group relative w-20 h-20 rounded-2xl bg-charcoal flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className={`w-full h-full object-cover transition-opacity ${isUploadingAvatar ? 'opacity-40' : 'opacity-100'}`}
                                        />
                                    ) : (
                                        <span className="text-2xl font-black text-accent">{user.name?.charAt(0).toUpperCase()}</span>
                                    )}

                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}

                                    {!isUploadingAvatar && (
                                        <div
                                            onClick={handleAvatarClick}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                                        >
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        disabled={isUploadingAvatar}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {isUploadingAvatar ? 'Loading...' : 'Update Avatar'}
                                    </button>
                                    <p className="text-[10px] text-text-muted mt-2">Max size: 2MB. JPG, PNG, GIF.</p>
                                    {avatarMessage.text && <p className="text-[10px] text-red-400 mt-1">{avatarMessage.text}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-text-muted tracking-widest">Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-text-muted tracking-widest">Email Address</label>
                                    <input type="email" value={user.email} disabled className="w-full bg-dark/50 border border-white/5 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed" />
                                </div>
                            </div>

                            {profileMessage.text && (
                                <p className={`text-sm ${profileMessage.type === 'error' ? 'text-red-400' : 'text-accent'}`}>{profileMessage.text}</p>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSavingProfile || name === user.name}
                                    className="px-8 py-3 bg-accent text-black font-black rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {isSavingProfile ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="bg-[#131316] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">Security & Password</h3>
                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-text-muted tracking-widest">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    required
                                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-text-muted tracking-widest">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        required
                                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-text-muted tracking-widest">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        required
                                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all"
                                    />
                                </div>
                            </div>
                            {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-400' : 'text-accent'}`}>{passwordMessage.text}</p>}
                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={isSavingPassword || !passwords.current} className="cursor-pointer px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Connections Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#131316] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-2">Connected Accounts</h3>
                        <p className="text-text-muted text-sm mb-6">Link social accounts for quick login.</p>
                        <div className="space-y-4">
                            {['discord', 'google'].map((provider) => {
                                const isConnected = provider === 'discord' ? hasDiscord : hasGoogle;
                                return (
                                    <div key={provider} className={`flex items-center justify-between p-4 bg-dark border rounded-2xl ${isConnected ? 'border-white/20' : 'border-white/5'}`}>
                                        <span className="flex items-center gap-2 font-bold text-sm capitalize">{provider === "discord" ? <FaDiscord /> : <FaGoogle />}{provider}</span>
                                        {isConnected ? (
                                            <button onClick={() => setProviderToDisconnect(provider as any)} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold rounded-lg transition-all cursor-pointer">
                                                Disconnect
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 bg-white/5 text-text-muted hover:text-white text-xs font-bold rounded-lg border border-white/10 transition-all cursor-pointer">
                                                Connect
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shadcn Dialog */}
            <AlertDialog open={!!providerToDisconnect} onOpenChange={() => setProviderToDisconnect(null)}>
                <AlertDialogContent className="bg-[#131316] border-white/10 text-white rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                        <AlertDialogDescription className="text-text-muted">
                            Це відʼєднає ваш <span className="capitalize font-bold text-white">{providerToDisconnect}</span> від профілю.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 rounded-xl">Скасувати</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDisconnect} className="bg-red-500 hover:bg-red-600 rounded-xl">Відʼєднати</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}