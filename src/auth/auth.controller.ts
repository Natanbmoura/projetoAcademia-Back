import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MemberLoginDto } from './dto/member-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('member/login')
  memberLogin(@Body() dto: MemberLoginDto) {
    return this.authService.memberLogin(dto);
  }

  @Post('member/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    // req.user.memberId contém o ID do member do JWT (se role === 'member')
    const memberId = req.user.memberId || req.user.sub;
    return this.authService.changeMemberPassword(memberId, dto.newPassword);
  }
}


