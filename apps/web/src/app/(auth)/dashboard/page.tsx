import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import ClientDashboard from './ClientDashboard';

export default async function DashboardPage() {
    let user;

    try {
        user = await AuthService.getProfile();
    } catch (error) {
        (await cookies()).delete('accessToken');
        redirect('/login');
    }

    return <ClientDashboard />;
}