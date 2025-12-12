import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Anamnesis } from '../anamneses/entities/anamnesis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Instructor, Anamnesis])],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService], // Exportar para usar no AuthModule
})
export class MembersModule {}


