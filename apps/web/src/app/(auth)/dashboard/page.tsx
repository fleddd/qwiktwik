import { redirect } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import ClientDashboard from './ClientDashboard';

export default async function DashboardPage() {
    const response = await AuthService.getProfile();
    if (!response.success) {
        redirect('/login');
    }
    return <ClientDashboard user={response.data} />;
}