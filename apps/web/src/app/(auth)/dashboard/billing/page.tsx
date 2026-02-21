import { AuthService } from '@/services/auth.service';
import BillingClient from './BillingClient';
import { Plan } from '@repo/database';

export default async function BillingPage() {
    const response = await AuthService.getProfile();

    // Використовуємо enum Plan. Якщо підписки немає, дефолт - FREE
    const currentPlan = response.success && response.data?.subscription
        ? response.data.subscription.plan
        : 'FREE' as Plan;

    const expiryDate = response.success && response.data?.subscription
        ? response.data.subscription.currentPeriodEnd
        : null;

    return <BillingClient currentPlan={currentPlan} expiryDate={expiryDate} />;
}