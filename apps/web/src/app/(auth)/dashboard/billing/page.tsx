import { AuthService } from '@/services/auth.service';
import BillingClient from './BillingClient';
// ВИДАЛЕНО: import { Plan } from '@repo/database';

export default async function BillingPage() {
    const response = await AuthService.getProfile();

    // Використовуємо звичайні стрічки замість enum
    const currentPlan = response.success && response.data?.subscription
        ? response.data.subscription.plan
        : 'FREE';

    const expiryDate = response.success && response.data?.subscription
        ? response.data.subscription.currentPeriodEnd
        : null;

    return <BillingClient currentPlan={currentPlan} expiryDate={expiryDate} />;
}
