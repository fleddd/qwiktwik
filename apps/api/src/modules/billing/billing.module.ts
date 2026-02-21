import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { NowPaymentsService } from './nowpayments.service';
import { SubscriptionCronService } from './subscription-cron.service'; // <-- Імпорт

@Module({
  controllers: [BillingController],
  providers: [BillingService, NowPaymentsService, SubscriptionCronService],
})
export class BillingModule { }