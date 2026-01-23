import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkoutTemplateItemDto {
  @IsString()
  @IsNotEmpty()
  exerciseName: string;

  @IsNumber()
  @IsNotEmpty()
  sets: number;

  @IsString()
  @IsNotEmpty()
  reps: string; // Ex: "8-12" ou "10"

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  rest?: string; // Ex: "60s" ou "60"

  @IsString()
  @IsOptional()
  observations?: string;
}

export class CreateWorkoutTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutTemplateItemDto)
  items: CreateWorkoutTemplateItemDto[];
}



