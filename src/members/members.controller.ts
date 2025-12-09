import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() dto: CreateMemberDto, @Req() req) {
    return this.membersService.create(dto, req.user.instructorId);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }
}

