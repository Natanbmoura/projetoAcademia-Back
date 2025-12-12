import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Member } from '../members/entities/member.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { WorkoutItem } from '../workout-items/entities/workout-item.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
    @InjectRepository(WorkoutItem)
    private readonly workoutItemsRepository: Repository<WorkoutItem>,
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
  ) {}

  async create(dto: CreateWorkoutDto, instructorId: string) {
    // 1. Achar o aluno
    const member = await this.membersRepository.findOne({ where: { id: dto.memberId } });
    if (!member) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    // 2. Achar o instrutor (que está logado)
    const instructor = await this.instructorsRepository.findOne({ where: { id: instructorId } });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado.');
    }

    // 3. Criar o treino
    const workout = this.workoutsRepository.create({
      ...dto,
      member,
      instructor,
    });

    return this.workoutsRepository.save(workout);
  }

  findAll() {
    return this.workoutsRepository.find({
      relations: ['member', 'instructor'], // Traz os nomes de quem é o treino
    });
  }
  
  // Buscar treinos de um aluno específico (Útil para o App do aluno)
  findByMember(memberId: string) {
    return this.workoutsRepository.find({
      where: { member: { id: memberId } },
      relations: ['instructor'],
    });
  }

  // Buscar treinos no formato esperado pelo frontend (com exercises dentro)
  async getTrainingForMember(memberId: string) {
    const workouts = await this.workoutsRepository.find({
      where: { member: { id: memberId } },
      relations: ['instructor'],
      order: { createdAt: 'ASC' },
    });

    // Para cada workout, buscar os workout items e converter para exercises
    const workoutsWithExercises = await Promise.all(
      workouts.map(async (workout, index) => {
        const workoutItems = await this.workoutItemsRepository.find({
          where: { workout: { id: workout.id } },
          relations: ['exercise'],
        });

        // Converter workout items para exercises no formato do frontend
        const exercises = workoutItems.map((item, exIndex) => ({
          id: item.id,
          name: item.exercise.name,
          series: item.sets,
          reps: String(item.repetitions),
          weight: item.weight || 0,
          rest: item.restTime ? `${item.restTime}s` : '60s',
          completed: false,
        }));

        // Determinar o tipo (A, B, C) baseado na ordem
        const types = ['A', 'B', 'C'] as const;
        const type = types[index % 3];

        return {
          id: workout.id,
          type,
          name: workout.title,
          exercises,
        };
      })
    );

    return workoutsWithExercises;
  }

  // Salvar treinos no formato do frontend
  async saveTrainingForMember(memberId: string, workouts: Array<{
    id?: string;
    type: string;
    name: string;
    exercises: Array<{
      id?: string;
      name: string;
      series: number;
      reps: string;
      weight: number;
      rest: string;
    }>;
  }>, instructorId: string) {
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    const instructor = await this.instructorsRepository.findOne({ where: { id: instructorId } });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado.');
    }

    // Deletar workouts antigos do membro
    const existingWorkouts = await this.workoutsRepository.find({
      where: { member: { id: memberId } },
    });

    for (const existingWorkout of existingWorkouts) {
      // Deletar workout items primeiro
      await this.workoutItemsRepository.delete({ workout: { id: existingWorkout.id } });
      // Depois deletar o workout
      await this.workoutsRepository.delete(existingWorkout.id);
    }

    // Criar novos workouts
    const savedWorkouts: Workout[] = [];
    for (const workoutData of workouts) {
      // Criar workout
      const workout = this.workoutsRepository.create({
        title: workoutData.name,
        description: `Treino ${workoutData.type}`,
        member,
        instructor,
        isActive: true,
      });
      const savedWorkout = await this.workoutsRepository.save(workout);

      // Criar exercícios para este workout
      for (const exerciseData of workoutData.exercises) {
        // Buscar ou criar exercício
        let exercise = await this.exercisesRepository.findOne({
          where: { name: exerciseData.name },
        });

        if (!exercise) {
          exercise = this.exercisesRepository.create({
            name: exerciseData.name,
            muscleGroup: 'Não especificado',
            description: null,
          });
          exercise = await this.exercisesRepository.save(exercise);
        }

        // Criar workout item
        // Extrair o tempo de descanso (pode ser "60s" ou "60")
        const restTimeStr = exerciseData.rest.replace(/[^0-9]/g, '');
        const restTime = parseInt(restTimeStr) || 60;
        
        // Extrair o número de repetições (pode ser "8-12" ou "10")
        // Pegar o primeiro número ou o número único
        const repsStr = exerciseData.reps.replace(/[^0-9-]/g, '');
        const repsMatch = repsStr.match(/(\d+)/);
        const repetitions = repsMatch ? parseInt(repsMatch[1]) : 10;
        
        const weight = exerciseData.weight && exerciseData.weight > 0 ? exerciseData.weight : null;

        const workoutItem = this.workoutItemsRepository.create({
          workout: savedWorkout,
          exercise,
          sets: exerciseData.series,
          repetitions,
          weight: weight,
          restTime,
        });
        await this.workoutItemsRepository.save(workoutItem);
      }

      savedWorkouts.push(savedWorkout);
    }

    return this.getTrainingForMember(memberId);
  }
}