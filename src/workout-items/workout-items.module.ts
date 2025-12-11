import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutItemsController } from './workout-items.controller';
import { WorkoutItemsService } from './workout-items.service';
import { WorkoutItem } from './entities/workout-item.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutItem, Workout, Exercise])],
  controllers: [WorkoutItemsController],
  providers: [WorkoutItemsService],
})
export class WorkoutItemsModule {}