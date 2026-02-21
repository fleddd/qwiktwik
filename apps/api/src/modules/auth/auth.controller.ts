import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  // --- LOCAL ROUTES ---

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  async login(@Req() req, @Body() dto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  // --- OAUTH ROUTES ---

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken } = await this.authService.validateOAuthLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

      return res.redirect(`${frontendUrl}/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error('❌ GOOGLE OAUTH ERROR:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=OAuthFailed`);
    }
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req) { }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken } = await this.authService.validateOAuthLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

      return res.redirect(`${frontendUrl}/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error('❌ DISCORD OAUTH ERROR:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=OAuthFailed`);
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
}