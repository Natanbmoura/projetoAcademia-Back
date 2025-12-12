import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() dto: CreateMemberDto, @Req() req) {
    return this.membersService.create(dto, req.user.instructorId);
  }

  @Get()
  findAll(@Req() req) {
    // Se for um instrutor logado, retornar apenas seus alunos
    if (req.user?.instructorId) {
      return this.membersService.findByInstructor(req.user.instructorId);
    }
    // Caso contrário, retornar todos (para outros casos de uso)
    return this.membersService.findAll();
  }

  // Rotas de ranking devem vir antes de :id para não serem capturadas como ID
  @Get('ranking/monthly')
  getMonthlyRanking() {
    return this.membersService.getRanking('monthly');
  }

  @Get('ranking/total')
  getTotalRanking() {
    return this.membersService.getRanking('total');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Get(':id/medical')
  getMedicalInfo(@Param('id') id: string) {
    return this.membersService.getMedicalInfo(id);
  }
}


