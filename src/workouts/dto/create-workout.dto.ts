import { IsNotEmpty, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Ex: "Treino A - Hipertrofia"

  @IsString()
  @IsOptional()
  description?: string; // Ex: "Focar na excêntrica"

  @IsUUID()
  @IsNotEmpty()
  memberId: string; // De qual aluno é esse treino?

  // O Instrutor a gente pega automático pelo token de quem tá logado (req.user)
  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // Se é o treino atual
}