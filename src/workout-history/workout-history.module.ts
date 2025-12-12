import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutHistory } from './entities/workout-history.entity';
import { WorkoutHistoryController } from './workout-history.controller';
import { WorkoutHistoryService } from './workout-history.service';
import { Member } from '../members/entities/member.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkoutHistory, Member, Workout]),
    MembersModule,
  ],
  controllers: [WorkoutHistoryController],
  providers: [WorkoutHistoryService],
  exports: [WorkoutHistoryService],
})
export class WorkoutHistoryModule {}