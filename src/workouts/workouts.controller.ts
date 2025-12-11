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
    return this.workoutsService.create(dto, req.user.id); // req.user.id ou req.user.instructorId dependendo do seu Auth
  }

  @Get()
  findAll() {
    return this.workoutsService.findAll();
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.workoutsService.findByMember(memberId);
  }
}