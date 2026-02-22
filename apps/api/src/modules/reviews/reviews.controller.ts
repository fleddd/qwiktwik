import { Controller, Post, Get, Body, UseGuards, Req, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/reviews.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    // Публічний доступ для лендінгу
    @Get()
    async getReviews() {
        const reviews = await this.reviewsService.getPublicReviews();
        return { success: true, data: reviews };
    }

    // Тільки авторизовані юзери з валідацією Zod
    @UseGuards(JwtAuthGuard)
    @UsePipes(ZodValidationPipe)
    @Post()
    async submitReview(@Req() req, @Body() dto: CreateReviewDto) {
        const review = await this.reviewsService.createOrUpdateReview(req.user.id, dto);
        return { success: true, data: review };
    }
}