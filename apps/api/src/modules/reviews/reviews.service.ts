import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/reviews.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdateReview(userId: string, dto: CreateReviewDto) {
        // Upsert зручний: якщо відгук є - оновлюємо, якщо нема - створюємо
        return this.prisma.review.upsert({
            where: { id: userId },
            update: {
                rating: dto.rating,
                text: dto.text,
            },
            create: {
                userId,
                rating: dto.rating,
                text: dto.text,
            },
        });
    }

    async getPublicReviews() {
        return this.prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true,
                        subscription: {
                            select: { plan: true },
                        },
                    },
                },
            },
        });
    }
}