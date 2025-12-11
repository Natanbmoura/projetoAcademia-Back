import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementsService } from './achievements.service';

@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(dto);
  }

  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  // Rota para entregar a medalha: POST /achievements/ID_DA_MEDALHA/assign/ID_DO_ALUNO
  @Post(':id/assign/:memberId')
  assignToMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.achievementsService.assignToMember(id, memberId);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.achievementsService.findByMember(memberId);
  }
}