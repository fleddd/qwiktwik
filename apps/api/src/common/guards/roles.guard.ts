import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Шукаємо ролі, прикріплені до методу або до всього класу (контролера)
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Якщо декоратор @Roles() не використовувався, пускаємо всіх (кому дозволив JwtAuthGuard)
        if (!requiredRoles) {
            return true;
        }

        // Дістаємо юзера з request (його туди поклав JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();

        // Якщо юзера немає або його ролі немає в списку дозволених — відмова
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have the required permissions to access this resource.');
        }

        return true;
    }
}