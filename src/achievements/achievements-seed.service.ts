import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

const ACHIEVEMENTS = [
  // Conquistas de Início (1-5)
  {
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    points: 10,
    iconUrl: '🎯',
  },
  {
    title: 'Iniciante',
    description: 'Complete 3 treinos',
    points: 25,
    iconUrl: '🌱',
  },
  {
    title: 'Dedicação',
    description: 'Complete 5 treinos',
    points: 50,
    iconUrl: '💪',
  },
  {
    title: 'Persistência',
    description: 'Complete 10 treinos',
    points: 100,
    iconUrl: '🔥',
  },
  {
    title: 'Guerreiro',
    description: 'Complete 25 treinos',
    points: 200,
    iconUrl: '⚔️',
  },

  // Conquistas de Sequência (6-10)
  {
    title: 'Chama Acesa',
    description: 'Mantenha uma sequência de 3 dias',
    points: 30,
    iconUrl: '🔥',
  },
  {
    title: 'Semana Forte',
    description: 'Mantenha uma sequência de 7 dias',
    points: 75,
    iconUrl: '📅',
  },
  {
    title: 'Mês de Ferro',
    description: 'Mantenha uma sequência de 30 dias',
    points: 300,
    iconUrl: '🏋️',
  },
  {
    title: 'Disciplina',
    description: 'Mantenha uma sequência de 15 dias',
    points: 150,
    iconUrl: '🎖️',
  },
  {
    title: 'Lenda',
    description: 'Mantenha uma sequência de 60 dias',
    points: 500,
    iconUrl: '👑',
  },

  // Conquistas de Nível (11-15)
  {
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    points: 100,
    iconUrl: '⭐',
  },
  {
    title: 'Nível 10',
    description: 'Alcance o nível 10',
    points: 250,
    iconUrl: '⭐⭐',
  },
  {
    title: 'Nível 20',
    description: 'Alcance o nível 20',
    points: 500,
    iconUrl: '⭐⭐⭐',
  },
  {
    title: 'Nível 30',
    description: 'Alcance o nível 30',
    points: 750,
    iconUrl: '💎',
  },
  {
    title: 'Mestre',
    description: 'Alcance o nível 50',
    points: 1000,
    iconUrl: '🏆',
  },

  // Conquistas de Exercícios (16-20)
  {
    title: 'Força Total',
    description: 'Complete 50 exercícios',
    points: 75,
    iconUrl: '💪',
  },
  {
    title: 'Máquina',
    description: 'Complete 100 exercícios',
    points: 150,
    iconUrl: '🤖',
  },
  {
    title: 'Titã',
    description: 'Complete 250 exercícios',
    points: 300,
    iconUrl: '⚡',
  },
  {
    title: 'Hércules',
    description: 'Complete 500 exercícios',
    points: 500,
    iconUrl: '🦾',
  },
  {
    title: 'Invencível',
    description: 'Complete 1000 exercícios',
    points: 1000,
    iconUrl: '🛡️',
  },

  // Conquistas Especiais (21-25)
  {
    title: 'Primeira Semana',
    description: 'Complete treinos em 5 dias diferentes na mesma semana',
    points: 100,
    iconUrl: '📆',
  },
  {
    title: 'Maratonista',
    description: 'Complete 3 treinos no mesmo dia',
    points: 150,
    iconUrl: '🏃',
  },
  {
    title: 'Noite de Treino',
    description: 'Complete um treino após as 20h',
    points: 50,
    iconUrl: '🌙',
  },
  {
    title: 'Madrugador',
    description: 'Complete um treino antes das 8h',
    points: 50,
    iconUrl: '🌅',
  },
  {
    title: 'Fim de Semana Ativo',
    description: 'Complete treinos em ambos os dias do fim de semana',
    points: 75,
    iconUrl: '🎉',
  },

  // Conquistas de XP (26-30)
  {
    title: 'Primeiros 100',
    description: 'Ganhe 100 pontos de XP',
    points: 25,
    iconUrl: '💯',
  },
  {
    title: 'Mil Pontos',
    description: 'Ganhe 1000 pontos de XP',
    points: 200,
    iconUrl: '🎯',
  },
  {
    title: 'Dez Mil',
    description: 'Ganhe 10000 pontos de XP',
    points: 500,
    iconUrl: '🌟',
  },
  {
    title: 'Cem Mil',
    description: 'Ganhe 100000 pontos de XP',
    points: 1000,
    iconUrl: '💫',
  },
  {
    title: 'Lenda Viva',
    description: 'Ganhe 500000 pontos de XP',
    points: 2000,
    iconUrl: '👑',
  },
];

@Injectable()
export class AchievementsSeedService implements OnModuleInit {
  private readonly logger = new Logger(AchievementsSeedService.name);

  constructor(private readonly achievementsService: AchievementsService) {}

  async onModuleInit() {
    const shouldSeed = process.env.SEED_ACHIEVEMENTS !== 'false';
    
    if (!shouldSeed) {
      this.logger.log('Seed de conquistas desabilitado (SEED_ACHIEVEMENTS=false)');
      return;
    }

    try {
      this.logger.log('🌱 Verificando conquistas no banco de dados...');
      
      const existingAchievements = await this.achievementsService.findAll();
      const existingTitles = new Set(
        existingAchievements.map((a) => a.title.toLowerCase()),
      );

      let created = 0;
      let skipped = 0;

      for (const achievement of ACHIEVEMENTS) {
        if (existingTitles.has(achievement.title.toLowerCase())) {
          skipped++;
          continue;
        }

        try {
          await this.achievementsService.create(achievement);
          created++;
          this.logger.log(`✅ Conquista criada: ${achievement.iconUrl} ${achievement.title}`);
        } catch (error) {
          this.logger.error(
            `❌ Erro ao criar conquista "${achievement.title}":`,
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      if (created > 0) {
        this.logger.log(`🎉 ${created} conquistas foram adicionadas ao banco de dados!`);
      } else if (skipped === ACHIEVEMENTS.length) {
        this.logger.log('✅ Todas as 30 conquistas já existem no banco de dados!');
      }
    } catch (error) {
      this.logger.error('❌ Erro ao executar seed de conquistas:', error);
    }
  }
}







