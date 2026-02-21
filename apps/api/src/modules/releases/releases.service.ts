import { Injectable, NotFoundException } from '@nestjs/common';
import { ReleaseResponse } from '@repo/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReleasesService {
    constructor(private prisma: PrismaService) { }

    async getLatestRelease(): Promise<ReleaseResponse> {
        const release = await this.prisma.release.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }, // Беремо найновіший
        });

        if (!release) throw new NotFoundException('No active releases found');

        return release;
    }

    async getAllReleases(): Promise<ReleaseResponse[]> {
        return this.prisma.release.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}