import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { VerifyDeviceDto } from './dto/verify-device.dto';
import { DeviceResponse, VerifyDeviceResponse } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) { }

  // Максимальна кількість ПК для різних планів
  private readonly DEVICE_LIMITS = {
    FREE: 1,
    PRO: 3,
  };

  async getAllDevicesForAdmin() {
    return this.prisma.device.findMany({
      include: {
        user: {
          select: { email: true, name: true }
        }
      },
      orderBy: { lastSeen: 'desc' },
    });
  }
  async adminDeleteDevice(deviceId: string) {
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return this.prisma.device.delete({ where: { id: deviceId } });
  }
  async verifyDevice(userId: string, dto: VerifyDeviceDto): Promise<VerifyDeviceResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true, devices: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const plan = user.subscription?.plan || 'FREE';
    const limit = this.DEVICE_LIMITS[plan];

    // 1. Шукаємо, чи цей ПК вже прив'язаний
    const existingDevice = user.devices.find((d) => d.hwid === dto.hwid);

    if (existingDevice) {
      // Оновлюємо час останнього онлайну
      await this.prisma.device.update({
        where: { id: existingDevice.id },
        data: { lastSeen: new Date(), name: dto.name || existingDevice.name },
      });
      return { success: true, plan, isNewDevice: false };
    }

    // 2. Якщо ПК новий — перевіряємо ліміти
    if (user.devices.length >= limit) {
      throw new ForbiddenException(`Device limit reached for ${plan} plan. Please unlink an old device or upgrade your plan.`);
    }

    // 3. Прив'язуємо новий ПК
    await this.prisma.device.create({
      data: {
        userId,
        hwid: dto.hwid,
        name: dto.name,
      },
    });

    return { success: true, plan, isNewDevice: true };
  }

  async getUserDevices(userId: string): Promise<DeviceResponse[]> {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
    });
  }

  async unlinkDevice(userId: string, deviceId: string): Promise<void> {
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });

    if (!device || device.userId !== userId) {
      throw new NotFoundException('Device not found or does not belong to you');
    }

    await this.prisma.device.delete({ where: { id: deviceId } });
  }
}