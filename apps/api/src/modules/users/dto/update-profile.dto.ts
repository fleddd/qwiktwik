import { updateProfileSchema } from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

export class UpdateProfileDto extends createZodDto(updateProfileSchema) { }