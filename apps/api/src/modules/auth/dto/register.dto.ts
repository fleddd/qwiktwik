import { RegisterSchema } from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

export class RegisterDto extends createZodDto(RegisterSchema) { }
