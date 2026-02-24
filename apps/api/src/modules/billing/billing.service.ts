import { Injectable, BadRequestException } from '@nestjs/common';
import { NowPaymentsService } from './nowpayments.service';
import { BillingInterval, Plan, SubStatus, TxStatus } from '@repo/database';
import { PrismaService } from 'src/prisma/prisma.service';
import { DodoPaymentsService } from './dodopayments.service';

@Injectable()
export class BillingService {
    constructor(
        private prisma: PrismaService,
        private nowPayments: NowPaymentsService,
        private dodoPayments: DodoPaymentsService,
    ) { }

    async createCheckout(userId: string, email: string, interval: BillingInterval, provider: 'nowpayments' | 'dodopayments' = 'dodopayments') {
        // Для крипти зберігаємо ціни у коді
        const cryptoPrices = {
            [BillingInterval.MONTHLY]: 9.99,
            [BillingInterval.YEARLY]: 59.88,
            [BillingInterval.LIFETIME]: 129.00,
        };

        // 1. Створюємо транзакцію в БД
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                // Для Dodo ми запишемо реальну суму вже у вебхуку, тому тут може бути 0
                amount: provider === 'nowpayments' ? cryptoPrices[interval] : 0,
                currency: 'USD',
                provider: provider,
                status: TxStatus.PENDING,
                intervalPaid: interval,
            },
        });

        // 2. Викликаємо відповідний сервіс
        if (provider === 'nowpayments') {
            return await this.nowPayments.createInvoice(transaction.id, cryptoPrices[interval], interval);
        } else {
            return await this.dodoPayments.createCheckout(transaction.id, interval, email);
        }
    }

    async getUserTransactions(userId: string) {
        return this.prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
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
    async processDodoWebhook(body: any) {
        const eventName = body.event || body.type;

        const validEvents = ['payment.succeeded'];

        if (!validEvents.includes(eventName)) {
            console.log(`[Dodo] Event ignored: ${eventName}`);
            // Повертаємо 200, щоб Dodo вважав вебхук доставленим
            return { received: true };
        }

        // 2. Безпечно дістаємо transactionId (Dodo може покласти його в різні місця залежно від івенту)
        const transactionId =
            body.data?.metadata?.transaction_id ||
            body.data?.subscription?.metadata?.transaction_id ||
            body.data?.payment?.metadata?.transaction_id;

        const providerTxId = String(body.data?.payment_id || body.data?.subscription_id || body.data?.id);

        if (!transactionId) {
            console.error('[Dodo Webhook] Missing transaction_id in metadata. Payload:', JSON.stringify(body));
            // Якщо це тестовий/лівий вебхук без нашої метадати - просто ігноруємо, щоб не блокувати чергу Dodo
            return { received: true };
        }

        try {
            return await this.prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.findUnique({ where: { id: transactionId } });

                if (!transaction) {
                    console.error('[Dodo Webhook] Transaction not found in DB:', transactionId);
                    return { received: true };
                }

                // Якщо транзакція вже оброблена - скіпаємо
                if (transaction.status === TxStatus.COMPLETED) {
                    console.log(`[Dodo] Transaction ${transactionId} already completed.`);
                    return { received: true };
                }

                // Знаходимо реальну суму (Dodo віддає її в центах)
                const totalAmount = body.data?.total_amount || body.data?.payment?.total_amount;
                const finalAmount = totalAmount ? totalAmount / 100 : transaction.amount;

                // Оновлюємо транзакцію
                await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: TxStatus.COMPLETED,
                        providerTxId: providerTxId,
                        amount: finalAmount
                    },
                });

                // Нараховуємо користувачу PRO статус
                const existingSub = await tx.subscription.findUnique({
                    where: { userId: transaction.userId }
                });

                const now = new Date();
                let baseDate = now;

                if (existingSub && existingSub.status === SubStatus.ACTIVE && existingSub.currentPeriodEnd && existingSub.currentPeriodEnd > now) {
                    baseDate = existingSub.currentPeriodEnd;
                }

                let endDate = new Date(baseDate);
                if (transaction.intervalPaid === 'MONTHLY') endDate.setMonth(endDate.getMonth() + 1);
                else if (transaction.intervalPaid === 'YEARLY') endDate.setFullYear(endDate.getFullYear() + 1);
                else if (transaction.intervalPaid === 'LIFETIME') endDate = new Date('2099-12-31');

                await tx.subscription.upsert({
                    where: { userId: transaction.userId },
                    create: {
                        userId: transaction.userId,
                        plan: 'PRO', // Або Plan.PRO, якщо використовуєш Enum
                        status: SubStatus.ACTIVE, // Або SubStatus.ACTIVE
                        interval: transaction.intervalPaid,
                        paymentProvider: 'dodopayments',
                        currentPeriodStart: now,
                        currentPeriodEnd: endDate,
                    },
                    update: {
                        plan: 'PRO',
                        status: SubStatus.ACTIVE,
                        interval: transaction.intervalPaid,
                        currentPeriodEnd: endDate,
                    },
                });

                console.log(`[Dodo] User ${transaction.userId} successfully upgraded to PRO!`);
                return { received: true };
            });
        } catch (error) {
            console.error('[Dodo Webhook] DB Transaction failed:', error);
            // Лише тут кидаємо помилку, щоб Dodo спробував ще раз, якщо впала база
            throw error;
        }
    }
}