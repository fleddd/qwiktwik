import { Controller, Post, Get, Body, UseGuards, Req, UsePipes, Delete, Param } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateReviewDto } from './create-review.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    async getReviews() {
        const reviews = await this.reviewsService.getPublicReviews();
        return { success: true, data: reviews };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyReview(@Req() req) {
        const review = await this.reviewsService.getUserReview(req.user.id);
        return { success: true, data: review };
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ZodValidationPipe)
    @Post()
    async submitReview(@Req() req, @Body() dto: CreateReviewDto) {
        const review = await this.reviewsService.createOrUpdateReview(req.user.id, dto);
        return { success: true, data: review };
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteReview(@Req() req) {
        await this.reviewsService.deleteReview(req.user.id);
        return { success: true, data: null };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('admin/all')
    async getAllForAdmin() {
        return this.reviewsService.getAllReviewsAdmin();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete('admin/:id')
    async deleteByAdmin(@Param('id') id: string) {
        await this.reviewsService.deleteReviewAdmin(id);
        return { success: true, message: 'Review deleted successfully' };
    }
}