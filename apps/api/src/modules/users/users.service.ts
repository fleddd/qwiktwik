import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@repo/database';
import * as argon2 from 'argon2';
import { UpdatePasswordInput } from '@repo/validation';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        oauthAccounts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordInput): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');
    if (!user.passwordHash) {
      throw new BadRequestException('Account created via social login. Please set a password first.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.current);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const newHash = await argon2.hash(dto.new);

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: newHash,
        passwordChangedAt: new Date(),
      },
    });
  }

  // НОВЕ: Відключення OAuth
  async disconnectOAuth(userId: string, provider: string) {
    const user = await this.findById(userId);

    // Перевіряємо, чи в юзера є пароль, перш ніж відв'язувати єдиний метод входу
    if (!user.passwordHash && user.oauthAccounts.length === 1) {
      throw new BadRequestException('Cannot disconnect the only login method. Please set a password first.');
    }

    await this.prisma.oAuthAccount.deleteMany({
      where: { userId, provider }
    });
  }
}