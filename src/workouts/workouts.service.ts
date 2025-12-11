import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Member } from '../members/entities/member.entity';
import { Instructor } from '../instructors/entities/instructor.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutsRepository: Repository<Workout>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
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
}