import { LoginSchema } from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(LoginSchema) { }