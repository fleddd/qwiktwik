import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync, IsUrl } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsNumber()
    PORT: number = 3000;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    JWT_SECRET: string;

    @IsUrl({ require_tld: false }) // false дозволяє localhost
    FRONTEND_URL: string;

    @IsUrl({ require_tld: false })
    BACKEND_URL: string;

    // --- NOWPayments ---
    @IsString()
    NOWPAYMENTS_API_KEY: string;

    @IsString()
    NOWPAYMENTS_IPN_SECRET: string;

    // --- Google OAuth ---
    @IsString()
    GOOGLE_CLIENT_ID: string;

    @IsString()
    GOOGLE_CLIENT_SECRET: string;

    @IsString()
    GOOGLE_CALLBACK_URL: string;

    // --- Discord OAuth ---
    @IsString()
    DISCORD_CLIENT_ID: string;

    @IsString()
    DISCORD_CLIENT_SECRET: string;

    @IsString()
    DISCORD_CALLBACK_URL: string;

    // --- Resend ---
    @IsString()
    RESEND_API_KEY: string;

    // --- Cloudinary ---
    @IsString()
    CLOUDINARY_NAME: string;

    @IsString()
    CLOUDINARY_API_KEY: string;

    @IsString()
    CLOUDINARY_API_SECRET: string;

    @IsString()
    CLOUDINARY_URL: string;

    // --- Dodo Payments ---
    @IsString()
    DODO_PAYMENTS_API_KEY: string;

    @IsString()
    DODO_PAYMENTS_WEBHOOK_SECRET: string;

    @IsString()
    DODO_PRODUCT_MONTHLY: string;

    @IsString()
    DODO_PRODUCT_YEARLY: string;

    @IsString()
    DODO_PRODUCT_LIFETIME: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(`❌ Помилка валідації .env файлу: ${errors.toString()}`);
    }

    return validatedConfig;
}