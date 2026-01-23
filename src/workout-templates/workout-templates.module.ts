import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutTemplatesService } from './workout-templates.service';
import { WorkoutTemplatesController } from './workout-templates.controller';
import { WorkoutTemplate } from './entities/workout-template.entity';
import { WorkoutTemplateItem } from './entities/workout-template-item.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Member } from '../members/entities/member.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { WorkoutItem } from '../workout-items/entities/workout-item.entity';
import { WorkoutsModule } from '../workouts/workouts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkoutTemplate,
      WorkoutTemplateItem,
      Instructor,
      Exercise,
      Member,
      Workout,
      WorkoutItem,
    ]),
    WorkoutsModule,
  ],
  controllers: [WorkoutTemplatesController],
  providers: [WorkoutTemplatesService],
  exports: [WorkoutTemplatesService],
})
export class WorkoutTemplatesModule {}

