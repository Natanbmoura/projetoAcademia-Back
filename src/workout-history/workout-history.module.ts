import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutHistory } from './entities/workout-history.entity';
// (Importe Controller e Service se criar os arquivos vazios, senão deixe sem por enquanto)

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutHistory])],
  exports: [TypeOrmModule],
})
export class WorkoutHistoryModule {}