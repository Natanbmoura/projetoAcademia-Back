import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutHistory } from './entities/workout-history.entity';
import { CreateWorkoutHistoryDto } from './dto/create-workout-history.dto';
import { Member } from '../members/entities/member.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { MembersService } from '../members/members.service';
import { AchievementsAutoService } from '../achievements/achievements-auto.service';

@Injectable()
export class WorkoutHistoryService {
  constructor(
    @InjectRepository(WorkoutHistory)
    private readonly historyRepository: Repository<WorkoutHistory>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
    private readonly membersService: MembersService,
    @Inject(forwardRef(() => AchievementsAutoService))
    private readonly achievementsAutoService: AchievementsAutoService,
  ) {}

  async create(dto: CreateWorkoutHistoryDto) {
    // 1. Validar Aluno
    const member = await this.membersRepository.findOne({ where: { id: dto.memberId } });
    if (!member) throw new NotFoundException('Aluno não encontrado.');

    // 2. Validar Treino
    const workout = await this.workoutsRepository.findOne({ where: { id: dto.workoutId } });
    if (!workout) throw new NotFoundException('Treino não encontrado.');

    // 3. Adicionar XP ao membro
    await this.membersService.addXP(dto.memberId, dto.xpEarned);

    // 4. Salvar Histórico
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

  async completeWorkout(memberId: string, workoutId: string) {
    console.log(`[WorkoutHistory] Completando treino - MemberId: ${memberId}, WorkoutId: ${workoutId}`);
    
    // 1. Validar Aluno
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!member) {
      console.error(`[WorkoutHistory] Aluno não encontrado: ${memberId}`);
      throw new NotFoundException('Aluno não encontrado.');
    }
    console.log(`[WorkoutHistory] Aluno encontrado: ${member.name}, XP atual: ${member.xp}`);

    // 2. Validar Treino
    const workout = await this.workoutsRepository.findOne({ where: { id: workoutId } });
    if (!workout) {
      console.error(`[WorkoutHistory] Treino não encontrado: ${workoutId}`);
      throw new NotFoundException('Treino não encontrado.');
    }
    console.log(`[WorkoutHistory] Treino encontrado: ${workout.title} (ID: ${workout.id})`);

    // 3. Verificar se já completou este treino hoje (opcional - para evitar duplicatas)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingHistory = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.memberId = :memberId', { memberId })
      .andWhere('history.workoutId = :workoutId', { workoutId })
      .andWhere('history.endTime >= :today', { today })
      .andWhere('history.endTime < :tomorrow', { tomorrow })
      .getOne();

    if (existingHistory) {
      // Já completou hoje, retornar o histórico existente
      const updatedMember = await this.membersRepository.findOne({ where: { id: memberId } });
      if (!updatedMember) {
        throw new NotFoundException('Membro não encontrado.');
      }
      return {
        id: existingHistory.id,
        xpEarned: existingHistory.xpEarned,
        member: {
          id: updatedMember.id,
          xp: updatedMember.xp,
          level: updatedMember.level,
          currentStreak: updatedMember.currentStreak,
        },
      };
    }

    // 4. Adicionar 10 XP ao membro
    const xpEarned = 10;
    console.log(`[WorkoutHistory] Adicionando ${xpEarned} XP ao membro ${memberId}`);
    await this.membersService.addXP(memberId, xpEarned);
    console.log(`[WorkoutHistory] XP adicionado com sucesso`);

    // 5. Salvar Histórico PRIMEIRO (antes de calcular streak)
    const now = new Date();
    const history = this.historyRepository.create({
      member,
      workout,
      startTime: now,
      endTime: now,
      xpEarned,
    });

    const savedHistory = await this.historyRepository.save(history);
    console.log(`[WorkoutHistory] Histórico salvo com ID: ${savedHistory.id}`);

    // 6. Calcular e atualizar streak DEPOIS de salvar o histórico
    await this.updateStreak(memberId);

    // 7. Verificar e desbloquear conquistas automaticamente
    try {
      await this.achievementsAutoService.checkAndUnlockAchievements(memberId);
    } catch (error) {
      console.error('[WorkoutHistory] Erro ao verificar conquistas:', error);
      // Não falhar o processo se houver erro nas conquistas
    }

    // 8. Buscar membro atualizado para retornar XP e level atualizados
    const updatedMember = await this.membersRepository.findOne({ where: { id: memberId } });
    
    if (!updatedMember) {
      throw new NotFoundException('Membro não encontrado após completar treino.');
    }

    return {
      id: savedHistory.id,
      xpEarned: savedHistory.xpEarned,
      member: {
        id: updatedMember.id,
        xp: updatedMember.xp,
        level: updatedMember.level,
        currentStreak: updatedMember.currentStreak,
      },
    };
  }

  // Atualizar streak do membro baseado no histórico de treinos
  private async updateStreak(memberId: string) {
    console.log(`[WorkoutHistory] Calculando streak para membro ${memberId}`);
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    if (!member) {
      console.error(`[WorkoutHistory] Membro não encontrado ao calcular streak: ${memberId}`);
      return;
    }

    // Buscar histórico de treinos ordenado por data (mais recente primeiro)
    const history = await this.historyRepository.find({
      where: { member: { id: memberId } },
      order: { endTime: 'DESC' },
    });

    console.log(`[WorkoutHistory] Histórico encontrado: ${history.length} treinos`);

    if (history.length === 0) {
      console.log(`[WorkoutHistory] Nenhum histórico, streak = 0`);
      member.currentStreak = 0;
      await this.membersRepository.save(member);
      return;
    }

    // Calcular streak: dias consecutivos com treinos
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verificar se treinou hoje
    const todayWorkouts = history.filter((h) => {
      const workoutDate = new Date(h.endTime);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === today.getTime();
    });

    console.log(`[WorkoutHistory] Treinos hoje: ${todayWorkouts.length}`);

    if (todayWorkouts.length === 0) {
      // Não treinou hoje, streak = 0
      console.log(`[WorkoutHistory] Não treinou hoje, streak = 0`);
      member.currentStreak = 0;
      await this.membersRepository.save(member);
      return;
    }

    // Treinou hoje, calcular dias consecutivos
    streak = 1;
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    // Limitar a busca a 365 dias para evitar loop infinito
    let daysChecked = 0;
    const maxDays = 365;

    while (daysChecked < maxDays) {
      const dayWorkouts = history.filter((h) => {
        const workoutDate = new Date(h.endTime);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === checkDate.getTime();
      });

      if (dayWorkouts.length > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        daysChecked++;
      } else {
        break;
      }
    }

    console.log(`[WorkoutHistory] Streak calculado: ${streak} dias`);
    member.currentStreak = streak;
    await this.membersRepository.save(member);
    console.log(`[WorkoutHistory] Streak salvo: ${member.currentStreak}`);
  }
}