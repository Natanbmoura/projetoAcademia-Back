import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnamnesesController } from './anamneses.controller';
import { AnamnesesService } from './anamneses.service';
import { Anamnesis } from './entities/anamnesis.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anamnesis, Member])],
  controllers: [AnamnesesController],
  providers: [AnamnesesService],
})
export class AnamnesesModule {}