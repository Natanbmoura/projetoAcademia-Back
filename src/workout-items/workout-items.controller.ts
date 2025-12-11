import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutItemDto } from './dto/create-workout-item.dto';
import { WorkoutItemsService } from './workout-items.service';

@UseGuards(JwtAuthGuard)
@Controller('workout-items')
export class WorkoutItemsController {
  constructor(private readonly itemsService: WorkoutItemsService) {}

  @Post()
  create(@Body() dto: CreateWorkoutItemDto) {
    return this.itemsService.create(dto);
  }

  @Get('workout/:workoutId')
  findAllByWorkout(@Param('workoutId') workoutId: string) {
    return this.itemsService.findAllByWorkout(workoutId);
  }
}