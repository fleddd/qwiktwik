import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AffiliateService } from './affiliate.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('affiliate')
export class AffiliateController {
    constructor(private readonly affiliateService: AffiliateService) { }

    @Get('stats')
    @Roles('AFFILIATE', 'ADMIN') // Доступ тільки партнерам та адмінам
    async getStats(@Request() req) {
        const data = await this.affiliateService.getStats(req.user.id);
        return { success: true, data };
    }

    @Post('code')
    @Roles('AFFILIATE', 'ADMIN')
    async setReferralCode(@Request() req, @Body('code') code: string) {
        await this.affiliateService.setReferralCode(req.user.id, code);
        return { success: true, message: 'Referral code saved successfully' };
    }

    @Post('wallet')
    @Roles('AFFILIATE', 'ADMIN')
    async setPayoutWallet(@Request() req, @Body('wallet') wallet: string) {
        await this.affiliateService.setPayoutWallet(req.user.id, wallet);
        return { success: true, message: 'Payout wallet saved successfully' };
    }

    @Post('withdraw')
    @Roles('AFFILIATE', 'ADMIN')
    async requestWithdrawal(@Request() req, @Body('amount') amount: number) {
        await this.affiliateService.requestWithdrawal(req.user.id, amount);
        return { success: true, message: 'Withdrawal request created successfully' };
    }
}