import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutHistoryDto } from './dto/create-workout-history.dto';
import { CompleteWorkoutDto } from './dto/complete-workout.dto';
import { WorkoutHistoryService } from './workout-history.service';

@UseGuards(JwtAuthGuard)
@Controller('workout-history')
export class WorkoutHistoryController {
  constructor(private readonly historyService: WorkoutHistoryService) {}

  @Post()
  create(@Body() dto: CreateWorkoutHistoryDto) {
    return this.historyService.create(dto);
  }

  @Get('member/:memberId')
  findByMember(@Param('memberId') memberId: string) {
    return this.historyService.findByMember(memberId);
  }

  @Post('complete')
  completeWorkout(@Body() dto: CompleteWorkoutDto, @Req() req) {
    console.log('[WorkoutHistoryController] ========== COMPLETAR TREINO ==========');
    console.log('[WorkoutHistoryController] Body recebido:', JSON.stringify(dto, null, 2));
    console.log('[WorkoutHistoryController] User do token:', JSON.stringify(req.user, null, 2));
    
    // Pega o memberId APENAS do token JWT (não do body)
    // O JWT strategy retorna { memberId, email, role: 'member' } para alunos
    // O DTO não aceita memberId no body para segurança
    let memberId = req.user?.memberId || req.user?.sub;
    
    // Se ainda não encontrou, tentar extrair do sub se for um ID de membro
    if (!memberId && req.user?.sub) {
      // Verificar se sub é um UUID (formato de ID de membro)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(req.user.sub)) {
        memberId = req.user.sub;
      }
    }
    
    if (!memberId) {
      console.error('[WorkoutHistoryController] ❌ Member ID não encontrado!');
      console.error('[WorkoutHistoryController] req.user completo:', JSON.stringify(req.user, null, 2));
      console.error('[WorkoutHistoryController] req.body completo:', JSON.stringify(req.body, null, 2));
      throw new Error('Member ID não encontrado. Faça login novamente.');
    }
    
    if (!dto.workoutId) {
      console.error('[WorkoutHistoryController] ❌ Workout ID não encontrado no body');
      throw new Error('Workout ID é obrigatório.');
    }
    
    console.log(`[WorkoutHistoryController] ✅ Usando memberId: ${memberId}`);
    console.log(`[WorkoutHistoryController] ✅ Usando workoutId: ${dto.workoutId}`);
    console.log('[WorkoutHistoryController] =================================');
    
    return this.historyService.completeWorkout(memberId, dto.workoutId);
  }
}