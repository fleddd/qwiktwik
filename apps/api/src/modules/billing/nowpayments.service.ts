import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class NowPaymentsService {
  private readonly logger = new Logger(NowPaymentsService.name);
  private readonly apiKey = process.env.NOWPAYMENTS_API_KEY;
  private readonly ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  async createInvoice(orderId: string, amount: number, interval: string) {
    try {
      const response = await axios.post(
        'https://api.nowpayments.io/v1/invoice', // Використовуємо Invoice API для посилання
        {
          price_amount: amount,
          price_currency: 'usd',
          order_id: orderId,
          order_description: `QwikTwik PRO: ${interval}`,
          ipn_callback_url: `${process.env.BACKEND_URL}/billing/webhook-nowpayments`,
          success_url: `${process.env.FRONTEND_URL}/dashboard/billing?status=success`,
          cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?status=cancel`,
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
        },
      );

      // В Invoice API посилання лежить у полі invoice_url
      return { url: response.data.invoice_url };
    } catch (e) {
      console.error('NOWPayments error:', e.response?.data || e.message);
      throw new InternalServerErrorException('Payment gateway error');
    }
  }

  // Перевірка справжності вебхуку (HMAC-SHA512)
  verifySignature(payload: any, signature: string): boolean {
    if (!signature || !this.ipnSecret) return false;

    // Сортування ключів обов'язкове для NOWPayments
    const sortedPayload = Object.keys(payload).sort().reduce((obj, key) => {
      obj[key] = payload[key];
      return obj;
    }, {});

    const hmac = crypto.createHmac('sha512', this.ipnSecret);
    const checkSignature = hmac.update(JSON.stringify(sortedPayload)).digest('hex');
    return checkSignature === signature;
  }
}