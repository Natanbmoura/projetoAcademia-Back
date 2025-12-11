import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anamnesis } from './entities/anamnesis.entity';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class AnamnesesService {
  constructor(
    @InjectRepository(Anamnesis)
    private readonly anamnesisRepository: Repository<Anamnesis>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async create(dto: CreateAnamnesisDto) {
    // 1. Verificar se o aluno existe
    const member = await this.membersRepository.findOne({ where: { id: dto.memberId } });
    if (!member) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    // 2. Verificar se ele já tem anamnese (Opcional, mas recomendado)
    const existing = await this.anamnesisRepository.findOne({ where: { member: { id: dto.memberId } } });
    if (existing) {
      throw new BadRequestException('Este aluno já possui uma anamnese cadastrada.');
    }

    // 3. Salvar
    const anamnesis = this.anamnesisRepository.create({
      ...dto,
      member: member,
    });
    return this.anamnesisRepository.save(anamnesis);
  }

  findAll() {
    return this.anamnesisRepository.find({ relations: ['member'] });
  }
}