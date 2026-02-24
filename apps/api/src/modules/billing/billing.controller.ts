import { Controller, Post, Body, Get, Headers, UseGuards, Request, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { BillingService } from './billing.service';
import { NowPaymentsService } from './nowpayments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BillingInterval } from '@repo/database';

@Controller('billing')
export class BillingController {
  constructor(
    private billingService: BillingService,
    private nowPayments: NowPaymentsService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout')
  async createCheckout(
    @Request() req,
    @Body('interval') interval: BillingInterval,
    @Body('provider') provider: 'nowpayments' | 'dodopayments' = 'dodopayments' // Дефолтно dodopayments
  ) {
    // ВАЖЛИВО: Переконайся, що email доступний у req.user.email 
    // Якщо ні - додай його у @Body('email')
    const userEmail = req.user.email;
    return this.billingService.createCheckout(req.user.id, userEmail, interval, provider);
  }

  // --- NOWPAYMENTS WEBHOOK ---
  @Post('webhook-nowpayments')
  async webhookNowPayments(@Body() body: any, @Headers('x-nowpayments-sig') sig: string) {
    return this.billingService.processWebhook(body); // Зверни увагу, це processWebhook
  }

  // --- DODO PAYMENTS WEBHOOK ---
  @Post('webhook-dodopayments')
  @HttpCode(HttpStatus.OK)
  async webhookDodoPayments(@Body() body: any) {
    console.log('=== DODO WEBHOOK RECEIVED ===');
    console.log(JSON.stringify(body, null, 2));

    return this.billingService.processDodoWebhook(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(@Request() req) {
    const transactions = await this.billingService.getUserTransactions(req.user.id);
    return { success: true, data: transactions };
  }
}