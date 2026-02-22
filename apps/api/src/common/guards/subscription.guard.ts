import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Перевір свій шлях
import { Plan, SubStatus } from '@repo/database';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Очікується, що перед цим відпрацював JwtAuthGuard

        if (!user || !user.id) {
            throw new ForbiddenException('User not authenticated');
        }

        // 1. Шукаємо підписку
        const sub = await this.prisma.subscription.findUnique({
            where: { userId: user.id }
        });

        // 2. Якщо підписки немає або вона не PRO
        if (!sub || sub.plan !== Plan.PRO || sub.status !== SubStatus.ACTIVE) {
            throw new ForbiddenException('This feature requires an active PRO subscription');
        }

        // 3. Автоматичне скасування (Lazy Expiration)
        const now = new Date();
        if (sub.currentPeriodEnd && sub.currentPeriodEnd < now) {
            // Час вийшов! Оновлюємо статус в базі, щоб не перевіряти це знову
            await this.prisma.subscription.update({
                where: { id: sub.id },
                data: {
                    status: SubStatus.INACTIVE,
                    plan: Plan.FREE
                }
            });
            throw new ForbiddenException('Your PRO subscription has expired');
        }

        // Всі перевірки пройдені, пускаємо далі
        return true;
    }
}

/*
@UseGuards(JwtAuthGuard, SubscriptionGuard) // <--- 
@Get('Pro-tweaks')
async getProTweaks() {
    return this.optimizationService.getProSettings();
}
*/