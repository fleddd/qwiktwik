import { AuthService } from '@/services/auth.service';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    // Дані вже закешовані Next.js з Layout, тому цей запит буде миттєвим
    const response = await AuthService.getProfile();
    const user = response.success ? response.data : null;

    if (!user) return null; // Захист, хоча Layout вже робить редірект

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight">Account Settings</h1>
                <p className="text-text-muted text-sm">Manage your profile, security, and connected accounts.</p>
            </div>

            <SettingsClient user={user} />
        </div>
    );
}