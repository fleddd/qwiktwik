import { createZodDto } from 'nestjs-zod';
import { RegisterSchema } from '@repo/validation';

export class CreateUserDto extends createZodDto(RegisterSchema) { }