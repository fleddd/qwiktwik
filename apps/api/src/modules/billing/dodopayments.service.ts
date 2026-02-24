import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { BillingInterval } from '@repo/database';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DodoPaymentsService {
    private readonly logger = new Logger(DodoPaymentsService.name);
    private readonly apiKey = process.env.DODO_PAYMENTS_API_KEY;
    private readonly webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    private readonly apiUrl: string;
    private readonly products = {
        [BillingInterval.MONTHLY]: process.env.DODO_PRODUCT_MONTHLY,
        [BillingInterval.YEARLY]: process.env.DODO_PRODUCT_YEARLY,
        [BillingInterval.LIFETIME]: process.env.DODO_PRODUCT_LIFETIME,
    };

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.apiUrl = this.configService.get("NODE_ENV") === "production"
            ? 'https://live.dodopayments.com'
            : 'https://test.dodopayments.com';
    }



    async createCheckout(transactionId: string, interval: BillingInterval, userEmail: string) {
        const productId = this.products[interval];

        if (!productId) {
            throw new BadRequestException(`Product ID for interval ${interval} is not configured.`);
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/checkouts`,
                {
                    product_cart: [
                        { product_id: productId, quantity: 1 }
                    ],
                    customer: {
                        email: userEmail
                    },
                    metadata: {
                        transaction_id: transactionId
                    },
                    return_url: `${process.env.FRONTEND_URL}/dashboard/billing?status=success`
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return { url: response.data.checkout_url };
        } catch (e) {
            this.logger.error('DodoPayments error:', e.response?.data || e.message);
            throw new InternalServerErrorException('Payment gateway error');
        }
    }

    verifySignature(rawBody: Buffer, signature: string): boolean {
        if (!signature || !this.webhookSecret) return false;

        const hmac = crypto.createHmac('sha256', this.webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length) return false;

        return crypto.timingSafeEqual(digest, signatureBuffer);
    }
}