import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutHistoryDto } from './dto/create-workout-history.dto';
import { CompleteWorkoutDto } from './dto/complete-workout.dto';
import { WorkoutHistoryService } from './workout-history.service';

@UseGuards(JwtAuthGuard)
@Controller('workout-history')
export class WorkoutHistoryController {
  constructor(private readonly historyService: WorkoutHistoryService) {}

  @Post()
  create(@Body() dto: CreateWorkoutHistoryDto) {
    return this.historyService.create(dto);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.historyService.findByMember(memberId);
  }

  @Post('complete')
  completeWorkout(@Body() dto: CompleteWorkoutDto, @Req() req) {
    // Pega o memberId do token (se for aluno) ou do body (se for instrutor)
    const memberId = req.user?.memberId || req.body.memberId;
    if (!memberId) {
      throw new Error('Member ID não encontrado');
    }
    return this.historyService.completeWorkout(memberId, dto.workoutId);
  }
}