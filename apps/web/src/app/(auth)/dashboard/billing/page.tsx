import { AuthService } from '@/services/auth.service';
import BillingClient from './BillingClient';

export default async function BillingPage() {
    const response = await AuthService.getProfile();
    const currentPlan = response.success ? response.data?.subscription?.plan! : 'FREE';

    return <BillingClient currentPlan={currentPlan} />;
}