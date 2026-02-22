import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReleasesService {
    constructor(private prisma: PrismaService) { }


    async getLatestRelease() {
        const release = await this.prisma.release.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!release) throw new NotFoundException('No active releases found');
        return release;
    }

    async getAllReleases() {
        return this.prisma.release.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    // --- АДМІНСЬКІ МЕТОДИ ---

    async getAdminReleases() {
        // Повертаємо всі релізи, відсортовані від найновіших
        return this.prisma.release.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async createRelease(data: { version: string; downloadUrl: string; changelog?: string; isActive?: boolean }) {
        const existing = await this.prisma.release.findUnique({
            where: { version: data.version }
        });

        if (existing) {
            throw new ConflictException(`Release version ${data.version} already exists.`);
        }

        return this.prisma.release.create({
            data,
        });
    }

    async updateRelease(id: string, data: { version?: string; downloadUrl?: string; changelog?: string; isActive?: boolean }) {
        return this.prisma.release.update({
            where: { id },
            data,
        });
    }

    async deleteRelease(id: string) {
        return this.prisma.release.delete({
            where: { id },
        });
    }
}