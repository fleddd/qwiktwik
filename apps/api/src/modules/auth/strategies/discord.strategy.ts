import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord'; // <-- ЗМІНЕНО ІМПОРТ
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('DISCORD_CLIENT_ID')!,
            clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('DISCORD_CALLBACK_URL')!,
            scope: ['identify', 'email'], // З 'passport-discord' as any більше не потрібен
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        try {
            if (!profile || !profile.id) {
                console.error('❌ Discord не повернув дані профілю!');
                return null;
            }

            const user = {
                email: profile.email,
                firstName: profile.username,
                picture: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '',
                provider: 'discord',
                providerId: profile.id,
            };

            return user;
        } catch (error) {
            console.error('❌ ПОМИЛКА У DISCORD VALIDATE:', error);
            return null;
        }
    }
}