import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { Anamnesis } from '../anamneses/entities/anamnesis.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
    @InjectRepository(Anamnesis)
    private readonly anamnesisRepository: Repository<Anamnesis>,
  ) {}

  async create(dto: CreateMemberDto, instructorId: string) {
    const instructor = await this.instructorsRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new ForbiddenException('Instrutor inválido');
    }

    // Extrair campos da anamnese do DTO
    const {
      mainGoal,
      experienceLevel,
      weeklyFrequency,
      healthNotes,
      ...memberData
    } = dto;

    // Criar hash da senha padrão "123"
    const defaultPassword = '123';
    const initialPasswordHash = await bcrypt.hash(defaultPassword, 10);

    // Criar o membro
    const member = this.membersRepository.create({
      ...memberData,
      passwordHash: initialPasswordHash,
      needsPasswordChange: true, // Precisa trocar senha no primeiro login
      createdByInstructor: instructor,
    });
    const savedMember = await this.membersRepository.save(member);

    // Criar a anamnese se houver dados relacionados
    if (mainGoal || experienceLevel || weeklyFrequency || healthNotes) {
      const anamnesis = new Anamnesis();
      anamnesis.member = savedMember;
      anamnesis.mainGoal = mainGoal || 'Não informado';
      anamnesis.experienceLevel = experienceLevel || 'Não informado';
      anamnesis.preferredTime = 'Não informado'; // Pode ser adicionado no frontend depois
      anamnesis.weeklyFrequency = weeklyFrequency || 'Não informado';
      anamnesis.healthProblems = healthNotes || null;
      anamnesis.medicalRestrictions = null;
      anamnesis.medication = null;
      anamnesis.injuries = null;
      anamnesis.activityLevel = 'Não informado';
      anamnesis.smokingStatus = 'Não informado';
      anamnesis.sleepHours = 'Não informado';
      await this.anamnesisRepository.save(anamnesis);
    }

    // Retornar o membro com a anamnese carregada
    return this.membersRepository.findOne({
      where: { id: savedMember.id },
      relations: ['createdByInstructor', 'anamnesis'],
    });
  }

  findAll() {
    return this.membersRepository.find({
      relations: ['createdByInstructor', 'anamnesis'],
    });
  }

  findByInstructor(instructorId: string) {
    return this.membersRepository.find({
      where: { createdByInstructor: { id: instructorId } },
      relations: ['createdByInstructor', 'anamnesis'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['createdByInstructor', 'anamnesis'],
    });

    if (!member) {
      throw new NotFoundException('Membro não encontrado');
    }

    // Adicionar informação de status ativo
    return {
      ...member,
      isActive: this.isMemberActive(member),
    };
  }

  async getMedicalInfo(id: string) {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['anamnesis'],
    });

    if (!member) {
      throw new NotFoundException('Membro não encontrado');
    }

    // Calcular idade
    const birthDate = new Date(member.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Converter anamnese para formato esperado pelo frontend
    const anamnesis = member.anamnesis;
    
    return {
      studentId: member.id,
      studentName: member.name,
      age,
      weight: member.weight ? Number(member.weight) : 0,
      height: member.height ? Number(member.height) : 0,
      bloodPressure: 'Não informado',
      heartCondition: anamnesis?.healthProblems?.toLowerCase().includes('cardíaco') || 
                      anamnesis?.healthProblems?.toLowerCase().includes('coração') || false,
      injuries: anamnesis?.injuries ? [anamnesis.injuries] : [],
      restrictions: anamnesis?.medicalRestrictions ? [anamnesis.medicalRestrictions] : [],
      notes: anamnesis?.healthProblems || anamnesis?.medicalRestrictions || 'Nenhuma observação',
    };
  }

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const member = await this.membersRepository
      .createQueryBuilder('member')
      .where('LOWER(member.email) = :email', { email: normalizedEmail })
      .getOne();
    
    return member;
  }

  async validateMember(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const member = await this.findByEmail(normalizedEmail);
    
    if (!member || !member.passwordHash) {
      console.log(`[MembersService] Membro não encontrado ou sem senha: ${normalizedEmail}`);
      return null;
    }

    // Verificar se a senha fornecida corresponde ao hash armazenado
    const isValid = await bcrypt.compare(password, member.passwordHash);
    
    if (!isValid) {
      console.log(`[MembersService] Senha incorreta para email: ${normalizedEmail}`);
      return null;
    }

    // Atualizar último login
    member.lastLoginAt = new Date();
    await this.membersRepository.save(member);

    console.log(`[MembersService] Login válido para membro: ${member.name} (${member.email})`);
    return member;
  }

  // Verificar se membro está ativo (fez login nos últimos 30 dias)
  isMemberActive(member: Member): boolean {
    if (!member.lastLoginAt) {
      return false;
    }
    const daysSinceLastLogin = Math.floor(
      (new Date().getTime() - new Date(member.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastLogin <= 30;
  }

  async changePassword(memberId: string, newPassword: string) {
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    
    if (!member) {
      throw new NotFoundException('Membro não encontrado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    member.passwordHash = passwordHash;
    member.needsPasswordChange = false;
    
    return this.membersRepository.save(member);
  }

  async addXP(memberId: string, xpAmount: number) {
    console.log(`[MembersService] ========== ADICIONANDO XP ==========`);
    console.log(`[MembersService] MemberId: ${memberId}`);
    console.log(`[MembersService] XP Amount: ${xpAmount}`);
    
    if (!memberId) {
      console.error(`[MembersService] ❌ MemberId é vazio ou undefined!`);
      throw new NotFoundException('Member ID é obrigatório');
    }
    
    if (!xpAmount || xpAmount <= 0) {
      console.error(`[MembersService] ❌ XP Amount inválido: ${xpAmount}`);
      throw new Error('XP Amount deve ser maior que zero');
    }
    
    const member = await this.membersRepository.findOne({ where: { id: memberId } });
    
    if (!member) {
      console.error(`[MembersService] ❌ Membro não encontrado: ${memberId}`);
      throw new NotFoundException('Membro não encontrado');
    }

    console.log(`[MembersService] Membro encontrado: ${member.name} (${member.email})`);
    console.log(`[MembersService] XP atual: ${member.xp} (tipo: ${typeof member.xp})`);
    console.log(`[MembersService] Level atual: ${member.level}`);

    const oldXP = Number(member.xp) || 0;
    const oldLevel = member.level || 1;

    // Garantir que XP seja um número válido
    const currentXP = Number(member.xp) || 0;
    const newXP = currentXP + xpAmount;
    
    // Adicionar XP
    member.xp = newXP;

    // Calcular novo level (cada level precisa de level * 50 XP)
    // Ex: Level 1 = 0-50 XP, Level 2 = 51-100 XP, Level 3 = 101-150 XP, etc.
    const newLevel = Math.floor(newXP / 50) + 1;
    member.level = newLevel;

    console.log(`[MembersService] XP atualizado: ${oldXP} -> ${newXP}`);
    console.log(`[MembersService] Level atualizado: ${oldLevel} -> ${newLevel}`);
    
    try {
      const savedMember = await this.membersRepository.save(member);
      console.log(`[MembersService] ✅ Membro salvo com sucesso!`);
      console.log(`[MembersService] XP final no banco: ${savedMember.xp} (tipo: ${typeof savedMember.xp})`);
      console.log(`[MembersService] Level final no banco: ${savedMember.level}`);
      console.log(`[MembersService] =================================`);
      
      return savedMember;
    } catch (error) {
      console.error(`[MembersService] ❌ Erro ao salvar membro:`, error);
      throw error;
    }
  }

  async getRanking(type: 'monthly' | 'total') {
    let query = this.membersRepository
      .createQueryBuilder('member')
      .select([
        'member.id',
        'member.name',
        'member.xp',
        'member.level',
        'member.lastLoginAt',
      ])
      .orderBy('member.xp', 'DESC')
      .limit(50);

    // Se for ranking mensal, filtrar apenas membros ativos (fizeram login nos últimos 30 dias)
    if (type === 'monthly') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      query.andWhere('member.lastLoginAt >= :thirtyDaysAgo', { thirtyDaysAgo });
    }

    const members = await query.getMany();

    // Converter para formato RankingUser com status ativo/inativo
    return members.map((member, index) => ({
      id: member.id,
      name: member.name,
      points: Number(member.xp),
      level: member.level,
      position: index + 1,
      isActive: this.isMemberActive(member),
      lastLoginAt: member.lastLoginAt ? member.lastLoginAt.toISOString() : null,
    }));
  }
}


