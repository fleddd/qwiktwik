import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const CurrentUser = createParamDecorator(
    (data: keyof any | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // Якщо ми передали конкретне поле, наприклад @CurrentUser('id')
        if (data) {
            return user ? user[data] : null;
        }

        // Інакше повертаємо всього юзера
        return user;
    },
);