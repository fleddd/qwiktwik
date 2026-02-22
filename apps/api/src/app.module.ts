import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { BillingModule } from './modules/billing/billing.module';
import { DevicesModule } from './modules/devices/devices.module';
import { ReleasesModule } from './modules/releases/releases.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './modules/reviews/reviews.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    BillingModule,
    DevicesModule,
    ReleasesModule,
    ReviewsModule
  ],
})
export class AppModule { }