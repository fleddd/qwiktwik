import { Controller, Get } from '@nestjs/common';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) { }

  // С++ програма і сайт будуть робити GET /releases/latest
  @Get('latest')
  async getLatest() {
    return this.releasesService.getLatestRelease();
  }

  // Для сторінки "Changelog" або "Історія версій"
  @Get()
  async getAll() {
    return this.releasesService.getAllReleases();
  }
}