import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateAnamnesisDto {
  @IsString()
  @IsNotEmpty()
  memberId: string; // Precisamos saber de qual aluno é essa ficha

  @IsString()
  @IsNotEmpty()
  mainGoal: string; // Objetivo principal

  @IsString()
  @IsNotEmpty()
  experienceLevel: string; // Iniciante, Intermediário...

  @IsString()
  @IsNotEmpty()
  preferredTime: string; // Manhã/Tarde/Noite

  @IsString()
  @IsNotEmpty()
  weeklyFrequency: string; // Quantas vezes por semana

  @IsString()
  @IsOptional()
  healthProblems?: string; // Opcional (nem todo mundo tem problema)

  @IsString()
  @IsOptional()
  medicalRestrictions?: string;

  @IsString()
  @IsOptional()
  medication?: string;

  @IsString()
  @IsOptional()
  injuries?: string;

  @IsString()
  @IsNotEmpty()
  activityLevel: string; // Sedentário, Ativo...

  @IsString()
  @IsNotEmpty()
  smokingStatus: string; // Fumante ou não

  @IsString()
  @IsNotEmpty()
  sleepHours: string;
}