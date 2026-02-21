import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Перевизначаємо метод handleRequest для кастомної обробки помилок
    handleRequest(err: any, user: any, info: any) {
        // Якщо сталася помилка або стратегія не повернула юзера (токен недійсний)
        if (err || !user) {
            throw err || new UnauthorizedException('Authentication token is missing or invalid. Please log in again.');
        }

        // Якщо все ок, повертаємо юзера (він автоматично потрапить у request.user)
        return user;
    }
}