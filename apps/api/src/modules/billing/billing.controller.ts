import { Controller, Post, Body, Get, Headers, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { NowPaymentsService } from './nowpayments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService, private nowPayments: NowPaymentsService) { }


  @UseGuards(JwtAuthGuard)
  @Post('create-checkout')
  async createCheckout(@Request() req, @Body('interval') interval: any) {
    return this.billingService.createCheckout(req.user.id, interval);
  }

  @Post('webhook-nowpayments')
  async webhook(@Body() body: any, @Headers('x-nowpayments-sig') sig: string) {
    // console.log('--- WEBHOOK RECEIVED ---');
    // console.log('Body:', JSON.stringify(body, null, 2));
    // console.log('Signature:', sig);
    // if (!this.nowPayments.verifySignature(body, sig)) {
    //   throw new UnauthorizedException('Security check failed');
    // }
    // console.log('Signature Valid');
    return this.billingService.processWebhook(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(@Request() req) {
    const transactions = await this.billingService.getUserTransactions(req.user.id);
    return { success: true, data: transactions };
  }
}