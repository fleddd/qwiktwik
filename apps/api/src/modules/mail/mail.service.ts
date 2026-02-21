import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        // Стилізований під QwikTwik лист
        const htmlTemplate = `
      <div style="font-family: monospace; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
        <h2 style="color: #00ff66; margin-bottom: 20px;">> SYSTEM OVERRIDE REQUEST</h2>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
          We received a request to override the security key (password) for your QwikTwik Elite account.
          If this was you, initialize the protocol by clicking the secure link below.
        </p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #00ff66; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
            AUTHORIZE NEW KEY
          </a>
        </div>
        <p style="color: #a1a1aa; font-size: 12px; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          This link will expire in 1 hour. If you didn't request this, ignore this transmission. Your current key remains secure.
        </p>
      </div>
    `;

        try {
            const { data } = await this.resend.emails.send({
                from: 'QwikTwik System <onboarding@resend.dev>',
                to: to,
                subject: '[QwikTwik] Password Override Protocol',
                html: htmlTemplate,
            });

            return data;
        } catch (error) {
            console.error('❌ Failed to dispatch email:', error);
        }
    }
}