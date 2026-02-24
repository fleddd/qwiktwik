import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { NowPaymentsService } from './nowpayments.service';
import { DodoPaymentsService } from './dodopayments.service';
import { SubscriptionCronService } from './subscription-cron.service';

@Module({
  controllers: [BillingController],
  providers: [
    BillingService,
    NowPaymentsService,
    DodoPaymentsService, // <-- Додано сюди
    SubscriptionCronService
  ],
})
export class BillingModule { }