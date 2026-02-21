import { Injectable, BadRequestException } from '@nestjs/common';
import { NowPaymentsService } from './nowpayments.service';
import { BillingInterval, Plan, SubStatus, TxStatus } from '@repo/database';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillingService {
    constructor(
        private prisma: PrismaService,
        private nowPayments: NowPaymentsService,
    ) { }

    async createCheckout(userId: string, interval: BillingInterval) {
        const prices = {
            [BillingInterval.MONTHLY]: 9.99,
            [BillingInterval.YEARLY]: 59.88,
            [BillingInterval.LIFETIME]: 129.00,
        };

        const amount = prices[interval];
        if (!amount) throw new BadRequestException('Invalid billing interval');

        // 1. Створюємо транзакцію в БД зі статусом PENDING
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                amount,
                currency: 'USD',
                provider: 'nowpayments',
                status: TxStatus.PENDING,
                intervalPaid: interval,
            },
        });

        // 2. Створюємо інвойс у NOWPayments
        return await this.nowPayments.createInvoice(transaction.id, amount, interval);
    }
    async getUserTransactions(userId: string) {
        return this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, // Найновіші зверху
        });
    }
    async processWebhook(body: any) {
        const { order_id, payment_status, payment_id } = body;

        if (payment_status !== 'finished') {
            return { message: 'Payment in progress' };
        }

        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.update({
                where: { id: order_id },
                data: {
                    status: TxStatus.COMPLETED,
                    providerTxId: String(payment_id)
                },
            });

            // 1. Отримуємо поточну підписку юзера
            const existingSub = await tx.subscription.findUnique({
                where: { userId: transaction.userId }
            });

            const now = new Date();
            // 2. Визначаємо базову дату для розрахунку
            let baseDate = now;

            if (
                existingSub &&
                existingSub.status === SubStatus.ACTIVE &&
                existingSub.currentPeriodEnd &&
                existingSub.currentPeriodEnd > now
            ) {
                baseDate = existingSub.currentPeriodEnd;
            }

            // 3. Додаємо час
            let endDate = new Date(baseDate);

            if (transaction.intervalPaid === BillingInterval.MONTHLY) {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (transaction.intervalPaid === BillingInterval.YEARLY) {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else if (transaction.intervalPaid === BillingInterval.LIFETIME) {
                endDate = new Date('2099-12-31');
            }

            // 4. Оновлюємо базу
            await tx.subscription.upsert({
                where: { userId: transaction.userId },
                create: {
                    userId: transaction.userId,
                    plan: Plan.PRO,
                    status: SubStatus.ACTIVE,
                    interval: transaction.intervalPaid,
                    paymentProvider: 'nowpayments',
                    currentPeriodStart: now,
                    currentPeriodEnd: endDate,
                },
                update: {
                    plan: Plan.PRO,
                    status: SubStatus.ACTIVE,
                    interval: transaction.intervalPaid, // Оновлюємо інтервал, якщо він перейшов на інший
                    currentPeriodEnd: endDate,
                },
            });

            console.log(`User ${transaction.userId} upgraded to PRO until ${endDate}`);
            return { success: true };
        });
    }
}