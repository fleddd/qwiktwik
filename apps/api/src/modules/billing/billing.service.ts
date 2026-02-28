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

    private async _distributeCommission(tx: any, payingUserId: string, paymentAmount: number) {
        if (paymentAmount <= 0) return;

        const user = await tx.user.findUnique({
            where: { id: payingUserId },
            select: { referredById: true }
        });

        if (user?.referredById) {
            const commission = paymentAmount * 0.15;

            await tx.user.update({
                where: { id: user.referredById },
                data: { affiliateBalance: { increment: commission } }
            });

        }
    }

    async createCheckout(userId: string, email: string, interval: BillingInterval, provider: 'nowpayments' | 'dodopayments' = 'dodopayments') {
        const cryptoPrices = {
            [BillingInterval.MONTHLY]: 9.99,
            [BillingInterval.YEARLY]: 59.88,
            [BillingInterval.LIFETIME]: 129.00,
        };

        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                amount: provider === 'nowpayments' ? cryptoPrices[interval] : 0,
                currency: 'USD',
                provider: provider,
                status: TxStatus.PENDING,
                intervalPaid: interval,
            },
        });

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

            const existingSub = await tx.subscription.findUnique({
                where: { userId: transaction.userId }
            });

            const now = new Date();
            let baseDate = now;

            if (
                existingSub &&
                existingSub.status === SubStatus.ACTIVE &&
                existingSub.currentPeriodEnd &&
                existingSub.currentPeriodEnd > now
            ) {
                baseDate = existingSub.currentPeriodEnd;
            }

            let endDate = new Date(baseDate);

            if (transaction.intervalPaid === BillingInterval.MONTHLY) {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (transaction.intervalPaid === BillingInterval.YEARLY) {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else if (transaction.intervalPaid === BillingInterval.LIFETIME) {
                endDate = new Date('2099-12-31');
            }

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
                    interval: transaction.intervalPaid,
                    currentPeriodEnd: endDate,
                },
            });

            // Нараховуємо 30% стримеру
            await this._distributeCommission(tx, transaction.userId, transaction.amount);

            return { success: true };
        });
    }

    async processDodoWebhook(body: any) {
        const eventName = body.event || body.type;
        const validEvents = ['payment.succeeded'];

        if (!validEvents.includes(eventName)) {
            return { received: true };
        }

        const transactionId =
            body.data?.metadata?.transaction_id ||
            body.data?.subscription?.metadata?.transaction_id ||
            body.data?.payment?.metadata?.transaction_id;

        const providerTxId = String(body.data?.payment_id || body.data?.subscription_id || body.data?.id);

        if (!transactionId) {
            console.error('[Dodo Webhook] Missing transaction_id in metadata');
            return { received: true };
        }

        try {
            return await this.prisma.$transaction(async (tx) => {
                const transaction = await tx.transaction.findUnique({ where: { id: transactionId } });

                if (!transaction) {
                    console.error('[Dodo Webhook] Transaction not found in DB:', transactionId);
                    return { received: true };
                }

                if (transaction.status === TxStatus.COMPLETED) {
                    return { received: true };
                }

                // ШУКАЄМО СУМУ (Dodo може повертати її в центах)
                const totalAmount = body.data?.total_amount || body.data?.payment?.total_amount;
                const finalAmount = totalAmount ? totalAmount / 100 : transaction.amount;


                await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: TxStatus.COMPLETED,
                        providerTxId: providerTxId,
                        amount: finalAmount // Оновлюємо суму в базі
                    },
                });

                // ... Твоя логіка endDate ...
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
                        plan: 'PRO',
                        status: SubStatus.ACTIVE,
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

                // ВИКЛИКАЄМО НАРАХУВАННЯ
                await this._distributeCommission(tx, transaction.userId, finalAmount);

                return { received: true };
            });
        } catch (error) {
            console.error('[Dodo Webhook] DB Transaction failed:', error);
            throw error;
        }
    }
}