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

    @IsString()
    RESEND_API_KEY: string;
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