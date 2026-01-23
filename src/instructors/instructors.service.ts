import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
  ) {}

  async create(createInstructorDto: CreateInstructorDto) {
    // Normalizar email antes de salvar
    const normalizedEmail = createInstructorDto.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(createInstructorDto.password, 10);
    const entity = this.instructorsRepository.create({
      ...createInstructorDto,
      email: normalizedEmail,
      passwordHash,
    });
    return this.instructorsRepository.save(entity);
  }

  findAll() {
    return this.instructorsRepository.find({
      select: ['id', 'name', 'email', 'cpf', 'createdAt'],
    });
  }

  findById(id: string) {
    return this.instructorsRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    // Normalizar email: trim e lowercase para busca case-insensitive
    const normalizedEmail = email.trim().toLowerCase();
    
    // Buscar com query case-insensitive usando LOWER
    // Isso garante que funciona mesmo se o email no banco tiver maiúsculas
    const instructor = await this.instructorsRepository
      .createQueryBuilder('instructor')
      .where('LOWER(instructor.email) = :email', { email: normalizedEmail })
      .getOne();
    
    return instructor;
  }
}

