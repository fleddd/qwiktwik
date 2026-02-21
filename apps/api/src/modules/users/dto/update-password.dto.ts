import { updatePasswordSchema } from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

export class UpdatePasswordDto extends createZodDto(updatePasswordSchema) { }