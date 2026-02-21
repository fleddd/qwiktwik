import { IsString, IsOptional, MinLength } from 'class-validator';

export class VerifyDeviceDto {
    @IsString()
    @MinLength(5, { message: 'HWID is too short' })
    hwid: string;

    @IsString()
    @IsOptional()
    name?: string; // Наприклад: "DESKTOP-X99" (C++ клієнт може отримувати ім'я ПК)
}