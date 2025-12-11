import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAnamnesisDto } from './dto/create-anamnesis.dto';
import { AnamnesesService } from './anamneses.service';

@UseGuards(JwtAuthGuard)
@Controller('anamneses')
export class AnamnesesController {
  constructor(private readonly anamnesesService: AnamnesesService) {}

  @Post()
  create(@Body() dto: CreateAnamnesisDto) {
    return this.anamnesesService.create(dto);
  }

  @Get()
  findAll() {
    return this.anamnesesService.findAll();
  }
}