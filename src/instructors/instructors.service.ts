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
    const passwordHash = await bcrypt.hash(createInstructorDto.password, 10);
    const entity = this.instructorsRepository.create({
      ...createInstructorDto,
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

  findByEmail(email: string) {
    return this.instructorsRepository.findOne({ where: { email } });
  }
}

