import { createZodDto } from 'nestjs-zod';
import { CreateReviewSchema } from '@repo/validation';

export class CreateReviewDto extends createZodDto(CreateReviewSchema) { }