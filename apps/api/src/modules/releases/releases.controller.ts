import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) { }

  // --- ПУБЛІЧНІ МАРШРУТИ ---
  @Get('latest')
  async getLatest() {
    return this.releasesService.getLatestRelease();
  }

  @Get()
  async getAll() {
    return this.releasesService.getAllReleases();
  }

  // --- АДМІНСЬКІ МАРШРУТИ ---

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminAll() {
    return this.releasesService.getAdminReleases();
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createRelease(@Body() body: { version: string; downloadUrl: string; changelog?: string; isActive?: boolean }) {
    return this.releasesService.createRelease(body);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRelease(@Param('id') id: string, @Body() body: any) {
    return this.releasesService.updateRelease(id, body);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteRelease(@Param('id') id: string) {
    return this.releasesService.deleteRelease(id);
  }
}