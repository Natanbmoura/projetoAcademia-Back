import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { Member } from '../members/entities/member.entity';
import { WorkoutHistory } from '../workout-history/entities/workout-history.entity';
import { AchievementsService } from './achievements.service';

@Injectable()
export class AchievementsAutoService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(WorkoutHistory)
    private readonly historyRepository: Repository<WorkoutHistory>,
    private readonly achievementsService: AchievementsService,
  ) {}

  // Verifica e desbloqueia conquistas automaticamente após completar treino
  async checkAndUnlockAchievements(memberId: string) {
    console.log(`[AchievementsAuto] Verificando conquistas para membro ${memberId}`);
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      console.error(`[AchievementsAuto] Membro não encontrado: ${memberId}`);
      return;
    }

    // Buscar todas as conquistas com suas relações carregadas
    const allAchievements = await this.achievementRepository.find({
      relations: ['members'],
    });
    console.log(`[AchievementsAuto] Total de conquistas disponíveis: ${allAchievements.length}`);
    
    // Buscar conquistas já desbloqueadas pelo membro usando query builder para garantir
    const unlockedAchievementIds = await this.achievementRepository
      .createQueryBuilder('achievement')
      .innerJoin('achievement.members', 'member', 'member.id = :memberId', { memberId })
      .select('achievement.id')
      .getMany()
      .then(achievements => achievements.map(a => a.id));
    
    console.log(`[AchievementsAuto] Conquistas já desbloqueadas: ${unlockedAchievementIds.length}`, unlockedAchievementIds);

    // Buscar histórico de treinos do membro
    const workoutHistory = await this.historyRepository.find({
      where: { member: { id: memberId } },
      order: { endTime: 'DESC' },
    });

    const totalWorkouts = workoutHistory.length;
    const totalXP = Number(member.xp) || 0;
    const currentLevel = member.level || 1;
    const currentStreak = member.currentStreak || 0;

    console.log(`[AchievementsAuto] Estatísticas do membro:`, {
      totalWorkouts,
      totalXP,
      currentLevel,
      currentStreak,
    });

    // Calcular exercícios completos (aproximação baseada em treinos)
    const totalExercises = totalWorkouts * 5; // Estimativa: ~5 exercícios por treino

    // Calcular dias únicos da semana atual
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekWorkouts = workoutHistory.filter((h) => {
      const workoutDate = new Date(h.endTime);
      return workoutDate >= startOfWeek;
    });

    const uniqueDaysThisWeek = new Set(
      weekWorkouts.map((h) => {
        const d = new Date(h.endTime);
        return d.toDateString();
      }),
    ).size;

    const unlockedAchievements: string[] = [];

    for (const achievement of allAchievements) {
      // Verificar se já tem a conquista usando a lista de IDs desbloqueados
      if (unlockedAchievementIds.includes(achievement.id)) {
        console.log(`[AchievementsAuto] Membro já tem a conquista: ${achievement.title}`);
        continue;
      }

      let shouldUnlock = false;

      // Verificar condições baseadas no título da conquista
      const title = achievement.title.toLowerCase();

      // Conquistas de treinos completos
      if (title.includes('primeiro passo') && totalWorkouts >= 1) {
        shouldUnlock = true;
      } else if (title.includes('iniciante') && totalWorkouts >= 3) {
        shouldUnlock = true;
      } else if (title.includes('dedicação') && totalWorkouts >= 5) {
        shouldUnlock = true;
      } else if (title.includes('persistência') && totalWorkouts >= 10) {
        shouldUnlock = true;
      } else if (title.includes('guerreiro') && totalWorkouts >= 25) {
        shouldUnlock = true;
      }

      // Conquistas de sequência (streak)
      else if (title.includes('chama acesa') && currentStreak >= 3) {
        shouldUnlock = true;
      } else if (title.includes('semana forte') && currentStreak >= 7) {
        shouldUnlock = true;
      } else if (title.includes('mês de ferro') && currentStreak >= 30) {
        shouldUnlock = true;
      } else if (title.includes('disciplina') && currentStreak >= 15) {
        shouldUnlock = true;
      } else if (title.includes('lenda') && currentStreak >= 60) {
        shouldUnlock = true;
      }

      // Conquistas de nível
      else if (title.includes('nível 5') && currentLevel >= 5) {
        shouldUnlock = true;
      } else if (title.includes('nível 10') && currentLevel >= 10) {
        shouldUnlock = true;
      } else if (title.includes('nível 20') && currentLevel >= 20) {
        shouldUnlock = true;
      } else if (title.includes('nível 30') && currentLevel >= 30) {
        shouldUnlock = true;
      } else if (title.includes('mestre') && currentLevel >= 50) {
        shouldUnlock = true;
      }

      // Conquistas de exercícios
      else if (title.includes('força total') && totalExercises >= 50) {
        shouldUnlock = true;
      } else if (title.includes('máquina') && totalExercises >= 100) {
        shouldUnlock = true;
      } else if (title.includes('titã') && totalExercises >= 250) {
        shouldUnlock = true;
      } else if (title.includes('hércules') && totalExercises >= 500) {
        shouldUnlock = true;
      } else if (title.includes('invencível') && totalExercises >= 1000) {
        shouldUnlock = true;
      }

      // Conquistas especiais
      else if (title.includes('primeira semana') && uniqueDaysThisWeek >= 5) {
        shouldUnlock = true;
      } else if (title.includes('fim de semana ativo')) {
        // Verificar se treinou no sábado e domingo da semana atual
        const saturday = new Date(startOfWeek);
        saturday.setDate(startOfWeek.getDate() + 6);
        const sunday = new Date(startOfWeek);
        sunday.setDate(startOfWeek.getDate() + 7);

        const hasSaturday = weekWorkouts.some((h) => {
          const d = new Date(h.endTime);
          return d.toDateString() === saturday.toDateString();
        });
        const hasSunday = weekWorkouts.some((h) => {
          const d = new Date(h.endTime);
          return d.toDateString() === sunday.toDateString();
        });

        if (hasSaturday && hasSunday) {
          shouldUnlock = true;
        }
      }

      // Conquistas de XP - Verificação direta por milestones
      else if (title.includes('primeiros 100') || title.includes('primeiro 100')) {
        if (totalXP >= 100) {
          shouldUnlock = true;
          console.log(`[AchievementsAuto] ✅ Condição XP atendida: ${totalXP} >= 100 para "${achievement.title}"`);
        }
      } else if (title.includes('mil pontos') || (title.includes('mil') && title.includes('pontos'))) {
        if (totalXP >= 1000) {
          shouldUnlock = true;
          console.log(`[AchievementsAuto] ✅ Condição XP atendida: ${totalXP} >= 1000 para "${achievement.title}"`);
        }
      } else if (title.includes('dez mil') || title.includes('10000')) {
        if (totalXP >= 10000) {
          shouldUnlock = true;
          console.log(`[AchievementsAuto] ✅ Condição XP atendida: ${totalXP} >= 10000 para "${achievement.title}"`);
        }
      } else if (title.includes('cem mil') || title.includes('100000')) {
        if (totalXP >= 100000) {
          shouldUnlock = true;
          console.log(`[AchievementsAuto] ✅ Condição XP atendida: ${totalXP} >= 100000 para "${achievement.title}"`);
        }
      } else if (title.includes('lenda viva') || title.includes('500000')) {
        if (totalXP >= 500000) {
          shouldUnlock = true;
          console.log(`[AchievementsAuto] ✅ Condição XP atendida: ${totalXP} >= 500000 para "${achievement.title}"`);
        }
      }
      
      // Verificação genérica por XP (fallback) - verificar descrição também
      if (!shouldUnlock) {
        const desc = (achievement.description || '').toLowerCase();
        const titleLower = title.toLowerCase();
        
        // Verificar se menciona XP ou pontos na descrição/título
        if (desc.includes('xp') || desc.includes('pontos') || titleLower.includes('xp') || titleLower.includes('pontos')) {
          // Tentar extrair número da descrição ou título
          const xpPatterns = [
            /(\d+)\s*(pontos?\s*de\s*xp|xp|pontos?)/i,
            /ganhe\s*(\d+)/i,
            /(\d+)\s*(pontos?|xp)/i,
          ];
          
          for (const pattern of xpPatterns) {
            const match = desc.match(pattern) || titleLower.match(pattern);
            if (match) {
              const requiredXP = parseInt(match[1]);
              if (!isNaN(requiredXP) && totalXP >= requiredXP) {
                shouldUnlock = true;
                console.log(`[AchievementsAuto] ✅ Condição XP genérica atendida: ${totalXP} >= ${requiredXP} para "${achievement.title}"`);
                break;
              }
            }
          }
        }
      }

      if (shouldUnlock) {
        console.log(`[AchievementsAuto] Desbloqueando conquista: ${achievement.title} (XP: ${totalXP}, Workouts: ${totalWorkouts}, Level: ${currentLevel}, Streak: ${currentStreak})`);
        // Usar o serviço para desbloquear (evita duplicatas)
        try {
          await this.achievementsService.assignToMember(achievement.id, memberId);
          unlockedAchievements.push(achievement.title);
          console.log(`[AchievementsAuto] ✅ Conquista desbloqueada: ${achievement.title}`);
        } catch (error) {
          // Ignorar se já tiver a conquista
          console.error(`[AchievementsAuto] ❌ Erro ao desbloquear "${achievement.title}":`, error);
        }
      }
    }

    if (unlockedAchievements.length > 0) {
      console.log(`[AchievementsAuto] 🎉 ${unlockedAchievements.length} conquista(s) desbloqueada(s):`, unlockedAchievements);
    } else {
      console.log(`[AchievementsAuto] Nenhuma conquista nova desbloqueada`);
    }

    return unlockedAchievements;
  }
}

