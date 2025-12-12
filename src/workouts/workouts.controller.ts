import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutsService } from './workouts.service';

@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Body() dto: CreateWorkoutDto, @Req() req) {
    // Pega o ID do instrutor direto do token de login (segurança)
    return this.workoutsService.create(dto, req.user.instructorId);
  }

  @Get()
  findAll() {
    return this.workoutsService.findAll();
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.workoutsService.findByMember(memberId);
  }

  @Get('training/:memberId')
  getTraining(@Param('memberId') memberId: string) {
    return this.workoutsService.getTrainingForMember(memberId);
  }

  @Post('training/:memberId')
  saveTraining(
    @Param('memberId') memberId: string,
    @Body() workouts: Array<{
      id?: string;
      type: string;
      name: string;
      exercises: Array<{
        id?: string;
        name: string;
        series: number;
        reps: string;
        weight: number;
        rest: string;
      }>;
    }>,
    @Req() req,
  ) {
    return this.workoutsService.saveTrainingForMember(memberId, workouts, req.user.instructorId);
  }
}