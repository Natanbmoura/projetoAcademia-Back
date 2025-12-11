import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // Cria um novo tipo de conquista (Ex: "Rei do Supino")
  create(dto: CreateAchievementDto) {
    const achievement = this.achievementRepository.create(dto);
    return this.achievementRepository.save(achievement);
  }

  // Lista todas as conquistas possíveis (Bloqueadas e Desbloqueadas)
  findAll() {
    return this.achievementRepository.find();
  }

  // Dá uma conquista para um aluno
  async assignToMember(achievementId: string, memberId: string) {
    // 1. Achar a conquista e carregar quem já tem ela
    const achievement = await this.achievementRepository.findOne({
      where: { id: achievementId },
      relations: ['members'], 
    });
    if (!achievement) throw new NotFoundException('Conquista não encontrada.');

    // 2. Achar o aluno
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Aluno não encontrado.');

    // 3. Adicionar o aluno na lista dessa conquista
    // (Verifica se já não tem para não duplicar)
    const alreadyHas = achievement.members.some((m) => m.id === member.id);
    if (!alreadyHas) {
      achievement.members.push(member);
      await this.achievementRepository.save(achievement);
      
      // Aqui você poderia somar o XP no aluno também, se quiser!
      // member.xp += achievement.points;
      // await this.memberRepository.save(member);
    }

    return achievement;
  }

  // Lista só as conquistas de um aluno específico
  async findByMember(memberId: string) {
    return this.achievementRepository.find({
      where: { members: { id: memberId } }
    });
  }
}