import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Ex: "Guerreiro"

  @IsString()
  @IsNotEmpty()
  description: string; // Ex: "Completou 10 treinos seguidos"

  @IsNumber()
  @IsNotEmpty()
  points: number; // Ex: 100 XP

  @IsString()
  @IsOptional()
  iconUrl?: string; // Link da imagem da medalha (opcional)
}