import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';
import { RegisterInput } from '@repo/validation';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  // --- LOCAL AUTHENTICATION ---

  async register(dto: RegisterInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hashing password with Argon2
    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        name: dto.name,
        // При реєстрації пароль ще не змінювався, залишаємо null
      },
    });

    return this.generateToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'If this email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpires,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If this email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      },
    });

    return { message: 'Password has been successfully reset.' };
  }

  async validateLocalUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, pass);

    if (isPasswordValid) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return this.generateToken(user);
  }

  // --- OAUTH AUTHENTICATION ---

  async validateOAuthLogin(profile: any) {
    const { email, firstName, lastName, picture, provider, providerId } = profile;

    if (!email) {
      throw new UnauthorizedException(`Email is missing from ${provider} profile`);
    }

    let oauthAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: provider,
          providerAccountId: providerId,
        },
      },
      include: { user: true },
    });

    let user;

    if (oauthAccount) {
      user = oauthAccount.user;
    } else {
      user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            name: `${firstName} ${lastName || ''}`.trim() || 'User',
            avatar: picture,
          },
        });
      }

      await this.prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: provider,
          providerAccountId: providerId,
        },
      });
    }

    return this.generateToken(user);
  }

  // --- HELPER METHODS ---

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}