import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutItem } from './entities/workout-item.entity';
import { CreateWorkoutItemDto } from './dto/create-workout-item.dto';
import { Workout } from '../workouts/entities/workout.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Injectable()
export class WorkoutItemsService {
  constructor(
    @InjectRepository(WorkoutItem)
    private readonly itemsRepository: Repository<WorkoutItem>,
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
  ) {}

  async create(dto: CreateWorkoutItemDto) {
    // 1. Validar se o Treino existe
    const workout = await this.workoutsRepository.findOne({ where: { id: dto.workoutId } });
    if (!workout) throw new NotFoundException('Treino não encontrado.');

    // 2. Validar se o Exercício existe
    const exercise = await this.exercisesRepository.findOne({ where: { id: dto.exerciseId } });
    if (!exercise) throw new NotFoundException('Exercício não encontrado.');

    // 3. Salvar o item
    const item = this.itemsRepository.create({
      ...dto,
      workout,
      exercise,
    });

    return this.itemsRepository.save(item);
  }

  // Buscar itens de um treino específico (Ex: Todos os exercícios do Treino A)
  findAllByWorkout(workoutId: string) {
    return this.itemsRepository.find({
      where: { workout: { id: workoutId } },
      relations: ['exercise'], // Traz os detalhes do exercício (nome, vídeo) junto
    });
  }
}