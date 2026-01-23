import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { Workout } from './entities/workout.entity';
import { Member } from '../members/entities/member.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { WorkoutItem } from '../workout-items/entities/workout-item.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { WorkoutHistory } from '../workout-history/entities/workout-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Member, Instructor, WorkoutItem, Exercise, WorkoutHistory])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService] // Exportamos caso precisemos usar em outro lugar
})
export class WorkoutsModule {}