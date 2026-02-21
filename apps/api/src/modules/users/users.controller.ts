import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileResponse } from '@repo/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<UserProfileResponse> {
    const user = await this.usersService.findById(id);

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
    };
  }
}