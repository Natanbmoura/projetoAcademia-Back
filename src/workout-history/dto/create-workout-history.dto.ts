import { IsNotEmpty, IsUUID, IsDateString, IsNumber } from 'class-validator';

export class CreateWorkoutHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsUUID()
  @IsNotEmpty()
  workoutId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string; // Hora que começou

  @IsDateString()
  @IsNotEmpty()
  endTime: string; // Hora que terminou

  @IsNumber()
  @IsNotEmpty()
  xpEarned: number; // XP ganho nessa sessão
}