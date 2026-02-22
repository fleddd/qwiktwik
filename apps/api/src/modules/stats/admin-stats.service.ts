import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminStatsService {
    constructor(private prisma: PrismaService) { }

    async getOverviewStats() {
        // 1. Загальна кількість користувачів
        const totalUsers = await this.prisma.user.count();

        // 2. Кількість активних PRO підписок
        const proSubscriptions = await this.prisma.subscription.count({
            where: { plan: 'PRO', status: 'ACTIVE' }
        });

        // 3. Загальний дохід (сумуємо всі успішні транзакції)
        const revenueData = await this.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' }
        });
        const totalRevenue = revenueData._sum.amount || 0;

        // 4. Кількість прив'язаних пристроїв
        const activeDevices = await this.prisma.device.count();

        // 5. Останні 5 зареєстрованих користувачів
        const recentUsers = await this.prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                role: true,
            }
        });

        return {
            totalUsers,
            proSubscriptions,
            totalRevenue,
            activeDevices,
            recentUsers
        };
    }
}