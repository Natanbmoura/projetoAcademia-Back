import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Instructor } from '../instructors/entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Instructor])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}

