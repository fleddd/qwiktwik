import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                passwordChangedAt: true
            }
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.passwordChangedAt) {
            const changedTimestamp = parseInt(
                (user.passwordChangedAt.getTime() / 1000).toString(),
                10
            );

            if (payload.iat < changedTimestamp) {
                throw new UnauthorizedException('Password was recently changed. Please log in again.');
            }
        }

        return { id: user.id, email: user.email };
    }
}