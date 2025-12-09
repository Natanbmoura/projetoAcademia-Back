import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
  ) {}

  async create(dto: CreateMemberDto, instructorId: string) {
    const instructor = await this.instructorsRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new ForbiddenException('Instrutor inválido');
    }

    const member = this.membersRepository.create({
      ...dto,
      createdByInstructor: instructor,
    });
    return this.membersRepository.save(member);
  }

  findAll() {
    return this.membersRepository.find({
      relations: ['createdByInstructor'],
    });
  }
}

