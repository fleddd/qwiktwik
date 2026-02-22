import { Controller, Get, Patch, Delete, Post, Param, Body, Request, UseGuards, UseInterceptors, UploadedFile, BadRequestException, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UserProfileResponse } from '@repo/types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly cloudinaryService: CloudinaryService) { }

  @Get('me')
  async getMe(@Request() req): Promise<UserProfileResponse> {
    const user = await this.usersService.findById(req.user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      subscription: user.subscription ? {
        plan: user.subscription.plan,
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
      } : null,
      oauthAccounts: user.oauthAccounts.map(acc => ({ provider: acc.provider })),
    };
  }

  @Patch('me')
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto): Promise<UserProfileResponse> {
    await this.usersService.update(req.user.id, { name: dto.name });
    return this.getMe(req);
  }

  @Patch('me/password')
  async updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    await this.usersService.updatePassword(req.user.id, dto);
    return { success: true, message: 'Password updated successfully' };
  }

  // НОВЕ: Роут для відключення OAuth
  @Delete('me/connections/:provider')
  async disconnectOAuth(@Request() req, @Param('provider') provider: string) {
    await this.usersService.disconnectOAuth(req.user.id, provider);
    return { success: true, message: `${provider} disconnected successfully` };
  }

  @Get()
  @Roles('ADMIN')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id/admin')
  @Roles('ADMIN')
  async updateUserAsAdmin(
    @Param('id') id: string,
    @Body() body: { role?: any; plan?: any }
  ) {
    await this.usersService.adminUpdateUser(id, body);
    return { success: true, message: 'User updated successfully' };
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    try {
      // 1. Завантажуємо в Cloudinary
      const result = await this.cloudinaryService.uploadFile(file);
      const avatarUrl = result.secure_url;

      // 2. ВАЖЛИВО: Зберігаємо посилання в Postgres через твій сервіс
      await this.usersService.update(req.user.id, { avatar: avatarUrl });

      // 3. Повертаємо результат (TransformInterceptor обгорне це в success: true)
      return { avatarUrl };
    } catch (e) {
      console.error('Upload error:', e);
      throw new BadRequestException('Could not upload image to cloud service.');
    }

  }
}