import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutHistory } from './entities/workout-history.entity';
import { CreateWorkoutHistoryDto } from './dto/create-workout-history.dto';
import { Member } from '../members/entities/member.entity';
import { Workout } from '../workouts/entities/workout.entity';

@Injectable()
export class WorkoutHistoryService {
  constructor(
    @InjectRepository(WorkoutHistory)
    private readonly historyRepository: Repository<WorkoutHistory>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
  ) {}

  async create(dto: CreateWorkoutHistoryDto) {
    // 1. Validar Aluno
    const member = await this.membersRepository.findOne({ where: { id: dto.memberId } });
    if (!member) throw new NotFoundException('Aluno não encontrado.');

    // 2. Validar Treino
    const workout = await this.workoutsRepository.findOne({ where: { id: dto.workoutId } });
    if (!workout) throw new NotFoundException('Treino não encontrado.');

    // 3. Salvar Histórico
    const history = this.historyRepository.create({
      ...dto,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      member,
      workout,
    });

    return this.historyRepository.save(history);
  }

  // Buscar todo histórico de um aluno (Para o gráfico de frequência)
  findByMember(memberId: string) {
    return this.historyRepository.find({
      where: { member: { id: memberId } },
      relations: ['workout'],
      order: { endTime: 'DESC' }, // Traz os mais recentes primeiro
    });
  }
}