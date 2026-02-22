import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class ReviewsService {
    private readonly logger = new Logger(ReviewsService.name);

    constructor(private prisma: PrismaService) { }

    async createOrUpdateReview(userId: string, dto: CreateReviewDto) {
        try {
            const existingReview = await this.prisma.review.findFirst({
                where: { userId: userId },
            });

            if (existingReview) {
                return await this.prisma.review.update({
                    where: { id: existingReview.id },
                    data: {
                        rating: dto.rating,
                        text: dto.text,
                    },
                });
            }

            return await this.prisma.review.create({
                data: {
                    userId,
                    rating: dto.rating,
                    text: dto.text,
                },
            });
        } catch (error) {
            this.logger.error(`Error saving review for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to save review. Please try again later.');
        }
    }

    async getPublicReviews() {
        try {
            return await this.prisma.review.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true,
                            subscription: { select: { plan: true } },
                        },
                    },
                },
            });
        } catch (error) {
            this.logger.error(`Error fetching public reviews: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to load reviews.');
        }
    }

    async getUserReview(userId: string) {
        try {
            return await this.prisma.review.findFirst({
                where: { userId: userId },
            });
        } catch (error) {
            this.logger.error(`Error fetching review for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to load your review.');
        }
    }

    async deleteReview(userId: string) {
        try {
            const result = await this.prisma.review.deleteMany({
                where: { userId: userId },
            });

            if (result.count === 0) {
                throw new NotFoundException('Review not found or already deleted.');
            }

            return { success: true };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting review for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to delete review.');
        }
    }

    async getAllReviewsAdmin() {
        return this.prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, avatar: true },
                },
            },
        });
    }

    async deleteReviewAdmin(reviewId: string) {
        return this.prisma.review.delete({
            where: { id: reviewId },
        });
    }
}