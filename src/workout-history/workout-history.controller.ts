import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutHistoryDto } from './dto/create-workout-history.dto';
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
}