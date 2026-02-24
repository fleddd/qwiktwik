import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@repo/database';
import * as argon2 from 'argon2';
import { UpdatePasswordInput } from '@repo/validation';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput, refCode?: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let referredById: string | null = null;

    if (refCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: refCode.trim().toUpperCase() },
      });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    return this.prisma.user.create({
      data: {
        ...data,
        ...(referredById ? { referredBy: { connect: { id: referredById } } } : {})
      }
    });
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

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: { plan: true, status: true }
        },
        _count: {
          select: {
            withdrawalRequests: { where: { status: 'PENDING' } }
          }
        }
      }
    });
  }

  async adminUpdateUser(userId: string, data: { role?: any; plan?: any }) {
    if (data.role) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: data.role },
      });
    }

    if (data.plan) {
      await this.prisma.subscription.upsert({
        where: { userId: userId },
        update: { plan: data.plan },
        create: {
          userId: userId,
          plan: data.plan,
          status: 'ACTIVE'
        },
      });
    }
    return true;
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

  async disconnectOAuth(userId: string, provider: string) {
    const user = await this.findById(userId);

    if (!user.passwordHash && user.oauthAccounts.length === 1) {
      throw new BadRequestException('Cannot disconnect the only login method. Please set a password first.');
    }

    await this.prisma.oAuthAccount.deleteMany({
      where: { userId, provider }
    });
  }
  async getAffiliateDetailsForAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        withdrawalRequests: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateWithdrawalStatus(requestId: string, status: 'COMPLETED' | 'REJECTED') {
    const request = await this.prisma.withdrawalRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request is already processed');

    return this.prisma.$transaction(async (tx) => {
      // Оновлюємо статус самого запиту
      const updatedReq = await tx.withdrawalRequest.update({
        where: { id: requestId },
        data: { status }
      });

      // ВАЖЛИВО: Якщо адмін ВІДХИЛИВ виплату, треба повернути гроші на баланс стрімеру
      if (status === 'REJECTED') {
        await tx.user.update({
          where: { id: request.userId },
          data: { affiliateBalance: { increment: request.amount } }
        });
      }

      return updatedReq;
    });
  }
  async setReferralCode(userId: string, desiredCode: string) {
    const code = desiredCode.trim().toUpperCase();

    const existing = await this.prisma.user.findUnique({ where: { referralCode: code } });
    if (existing && existing.id !== userId) {
      throw new ConflictException('This referral code is already taken.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
  }

  async getAffiliateStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            subscription: { select: { plan: true, status: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        withdrawalRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      referralCode: user.referralCode,
      balance: user.affiliateBalance,
      payoutWallet: user.payoutWallet,
      referralsCount: user.referrals.length,
      referrals: user.referrals,
      withdrawals: user.withdrawalRequests
    };
  }
}