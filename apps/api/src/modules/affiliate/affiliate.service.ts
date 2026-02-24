import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AffiliateService {
    constructor(private prisma: PrismaService) { }

    // 1. Отримати статистику стримера
    async getStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                        subscription: { select: { plan: true, status: true } },
                        // Дістаємо всі успішні транзакції цього реферала
                        transactions: {
                            where: { status: 'COMPLETED' },
                            select: { amount: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                withdrawalRequests: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!user) throw new NotFoundException('User not found');

        // Рахуємо прибуток для кожного реферала (30% від суми їхніх оплат)
        const referralsWithRevenue = user.referrals.map(ref => {
            const totalSpent = ref.transactions.reduce((sum, tx) => sum + tx.amount, 0);
            return {
                ...ref,
                revenueGenerated: totalSpent * 0.30 // 30% комісії
            };
        });

        return {
            referralCode: user.referralCode,
            balance: user.affiliateBalance,
            payoutWallet: user.payoutWallet,
            totalReferrals: user.referrals.length,
            referrals: referralsWithRevenue, // Використовуємо новий масив
            recentWithdrawals: user.withdrawalRequests
        };
    }

    // 2. Встановити кастомний реферальний код
    async setReferralCode(userId: string, code: string) {
        const normalizedCode = code.trim().toUpperCase();
        if (normalizedCode.length < 3) throw new BadRequestException('Code must be at least 3 characters');

        const existing = await this.prisma.user.findUnique({ where: { referralCode: normalizedCode } });
        if (existing && existing.id !== userId) {
            throw new ConflictException('This referral code is already taken');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { referralCode: normalizedCode },
        });
    }

    // 3. Встановити гаманець для виплат
    async setPayoutWallet(userId: string, walletAddress: string) {
        if (!walletAddress.trim()) throw new BadRequestException('Wallet address cannot be empty');

        return this.prisma.user.update({
            where: { id: userId },
            data: { payoutWallet: walletAddress.trim() },
        });
    }

    // 4. Створити запит на вивід коштів
    async requestWithdrawal(userId: string, amount: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException('This user doesn\'t exist.');
        }

        if (!user.payoutWallet) throw new BadRequestException('Please set your payout wallet first');

        if (amount < 20) throw new BadRequestException('Minimum withdrawal amount is $20');
        if (user.affiliateBalance < amount) throw new BadRequestException('Insufficient affiliate balance');

        // Створюємо запит і списуємо баланс в одній транзакції
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.withdrawalRequest.create({
                data: {
                    userId,
                    amount,
                    walletAddress: user.payoutWallet!,
                    status: 'PENDING'
                }
            });

            await tx.user.update({
                where: { id: userId },
                data: { affiliateBalance: { decrement: amount } }
            });

            return request;
        });
    }
}