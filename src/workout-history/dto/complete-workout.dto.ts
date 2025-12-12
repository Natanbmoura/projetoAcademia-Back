import { IsNotEmpty, IsUUID } from 'class-validator';

export class CompleteWorkoutDto {
  @IsUUID()
  @IsNotEmpty()
  workoutId: string;
}


