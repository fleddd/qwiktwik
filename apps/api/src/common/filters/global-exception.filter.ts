import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '@repo/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        let details = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse: any = exception.getResponse();

            // Обробка дефолтних помилок NestJS та class-validator
            if (typeof exceptionResponse === 'object') {
                message = Array.isArray(exceptionResponse.message)
                    ? exceptionResponse.message[0] // Беремо першу помилку валідації для загального повідомлення
                    : exceptionResponse.message || exception.message;

                code = exceptionResponse.error?.toUpperCase().replace(/\s+/g, '_') || 'HTTP_ERROR';

                if (Array.isArray(exceptionResponse.message)) {
                    details = exceptionResponse.message;
                    code = 'VALIDATION_ERROR';
                }
            } else {
                message = exceptionResponse;
            }
        }

        const errorBody: ApiErrorResponse = {
            success: false,
            error: { status, code, message, details },
        };

        response.status(status).json(errorBody);
    }
}