import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  emergencyPhone: string;

  @IsEmail()
  emergencyEmail: string;

  // Campos opcionais para dados físicos
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  // Campos da anamnese
  @IsString()
  @IsOptional()
  mainGoal?: string; // Objetivo principal

  @IsString()
  @IsOptional()
  experienceLevel?: string; // Experiência com exercícios

  @IsString()
  @IsOptional()
  weeklyFrequency?: string; // Frequência de treino

  @IsString()
  @IsOptional()
  healthNotes?: string; // Observações de saúde
}


