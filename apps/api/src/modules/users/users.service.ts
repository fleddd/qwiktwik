// apps/api/src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Перевір шлях до твого PrismaService
import { Prisma, User } from '@repo/database';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    return this.prisma.user.create({ data });
  }

  // Використовуватиметься в AuthModule при логіні
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Користувач не знайдений');
    }
    return user;
  }

  // Оновлення профілю
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}