import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { VerifyDeviceDto } from './dto/verify-device.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard) // Усі роути вимагають логіну
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  // Ендпоінт для C++ клієнта (Перевірка пристрою при запуску)
  @Post('verify')
  async verifyDevice(@Request() req, @Body() dto: VerifyDeviceDto) {
    return this.devicesService.verifyDevice(req.user.id, dto);
  }

  // Ендпоінт для Next.js (Отримати список ПК)
  @Get()
  async getDevices(@Request() req) {
    return this.devicesService.getUserDevices(req.user.id);
  }

  // Ендпоінт для Next.js (Відв'язати ПК)
  @Delete(':id')
  async unlinkDevice(@Request() req, @Param('id') deviceId: string) {
    await this.devicesService.unlinkDevice(req.user.id, deviceId);
    return { message: 'Device unlinked successfully' };
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAllDevicesAdmin() {
    return this.devicesService.getAllDevicesForAdmin();
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async adminUnlinkDevice(@Param('id') deviceId: string) {
    await this.devicesService.adminDeleteDevice(deviceId);
    return { message: 'Device (HWID) reset successfully by Admin' };
  }
}