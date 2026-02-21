import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plan, SubStatus } from '@repo/database';

@Injectable()
export class SubscriptionCronService {
    private readonly logger = new Logger(SubscriptionCronService.name);

    constructor(private readonly prisma: PrismaService) { }

    // Цей метод буде запускатися автоматично КОЖНУ ГОДИНУ
    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredSubscriptions() {
        this.logger.log('Starting check for expired subscriptions...');

        const now = new Date();

        try {
            // Знаходимо і оновлюємо всі підписки, де час вийшов, 
            // але статус все ще ACTIVE
            const result = await this.prisma.subscription.updateMany({
                where: {
                    status: SubStatus.ACTIVE,
                    currentPeriodEnd: {
                        lt: now, // lt (less than) - дата закінчення менша за поточний час
                    },
                },
                data: {
                    status: SubStatus.INACTIVE,
                    plan: Plan.FREE,
                },
            });

            if (result.count > 0) {
                this.logger.log(`Successfully expired ${result.count} subscriptions.`);
            } else {
                this.logger.log('No expired subscriptions found.');
            }
        } catch (error) {
            this.logger.error('Error while expiring subscriptions', error);
        }
    }
}