import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
  ) {}

  create(dto: CreateExerciseDto) {
    const exercise = this.exercisesRepository.create(dto);
    return this.exercisesRepository.save(exercise);
  }

  findAll() {
    return this.exercisesRepository.find();
  }
}