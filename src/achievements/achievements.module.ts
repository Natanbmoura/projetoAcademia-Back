import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AchievementsSeedService } from './achievements-seed.service';
import { AchievementsAutoService } from './achievements-auto.service';
import { Achievement } from './entities/achievement.entity';
import { Member } from '../members/entities/member.entity';
import { WorkoutHistory } from '../workout-history/entities/workout-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, Member, WorkoutHistory]),
  ],
  controllers: [AchievementsController],
  providers: [
    AchievementsService,
    AchievementsSeedService,
    AchievementsAutoService,
  ],
  exports: [AchievementsAutoService, AchievementsService],
})
export class AchievementsModule {}