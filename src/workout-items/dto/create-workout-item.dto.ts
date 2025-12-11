import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutItemDto {
  @IsUUID()
  @IsNotEmpty()
  workoutId: string; // "Esse item pertence ao Treino A"

  @IsUUID()
  @IsNotEmpty()
  exerciseId: string; // "Esse item é o exercício Supino"

  @IsNumber()
  @IsNotEmpty()
  sets: number; // Ex: 3 séries

  @IsNumber() // Pode ser string se preferir "10-12", mas number é melhor pra conta
  @IsNotEmpty()
  repetitions: number; // Ex: 10 repetições

  @IsNumber()
  @IsOptional()
  weight?: number; // Ex: 20kg (Opcional)

  @IsNumber()
  @IsOptional()
  restTime?: number; // Ex: 60 segundos de descanso

  @IsString()
  @IsOptional()
  observations?: string; // Ex: "Fazer drop-set na última"
}