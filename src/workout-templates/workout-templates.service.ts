import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutTemplate } from './entities/workout-template.entity';
import { WorkoutTemplateItem } from './entities/workout-template-item.entity';
import { CreateWorkoutTemplateDto } from './dto/create-workout-template.dto';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Member } from '../members/entities/member.entity';
import { Workout } from '../workouts/entities/workout.entity';
import { WorkoutItem } from '../workout-items/entities/workout-item.entity';
import { WorkoutsService } from '../workouts/workouts.service';

@Injectable()
export class WorkoutTemplatesService {
  constructor(
    @InjectRepository(WorkoutTemplate)
    private readonly templateRepository: Repository<WorkoutTemplate>,
    @InjectRepository(WorkoutTemplateItem)
    private readonly templateItemRepository: Repository<WorkoutTemplateItem>,
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutItem)
    private readonly workoutItemRepository: Repository<WorkoutItem>,
    private readonly workoutsService: WorkoutsService,
  ) {}

  async create(dto: CreateWorkoutTemplateDto, instructorId: string) {
    const instructor = await this.instructorRepository.findOne({
      where: { id: instructorId },
    });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado.');
    }

    // Criar template
    const template = this.templateRepository.create({
      title: dto.title,
      description: dto.description || null,
      instructor,
    });
    const savedTemplate = await this.templateRepository.save(template);

    // Criar items do template
    for (const itemDto of dto.items) {
      // Buscar ou criar exercício
      let exercise = await this.exerciseRepository.findOne({
        where: { name: itemDto.exerciseName },
      });

      if (!exercise) {
        exercise = this.exerciseRepository.create({
          name: itemDto.exerciseName,
          muscleGroup: 'Não especificado',
          description: null,
        });
        exercise = await this.exerciseRepository.save(exercise);
      }

      // Extrair restTime
      const restTimeStr = itemDto.rest?.replace(/[^0-9]/g, '') || '60';
      const restTime = parseInt(restTimeStr) || 60;

      // Criar item do template
      const templateItem = this.templateItemRepository.create({
        template: savedTemplate,
        exercise,
        sets: itemDto.sets,
        repetitions: this.extractRepetitions(itemDto.reps),
        weight: itemDto.weight && itemDto.weight > 0 ? itemDto.weight : null,
        restTime,
        observations: itemDto.observations || null,
      });
      await this.templateItemRepository.save(templateItem);
    }

    return this.findOne(savedTemplate.id);
  }

  async findAll(instructorId?: string) {
    const where = instructorId ? { instructor: { id: instructorId } } : {};
    return this.templateRepository.find({
      where,
      relations: ['instructor', 'items', 'items.exercise'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['instructor', 'items', 'items.exercise'],
    });
    if (!template) {
      throw new NotFoundException('Template não encontrado.');
    }
    return template;
  }

  async applyTemplate(templateId: string, memberId: string, instructorId: string) {
    // Buscar template
    const template = await this.findOne(templateId);
    
    // Verificar se o template pertence ao instrutor
    if (template.instructor.id !== instructorId) {
      throw new NotFoundException('Template não encontrado ou sem permissão.');
    }

    // Buscar aluno
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    // Buscar instrutor
    const instructor = await this.instructorRepository.findOne({
      where: { id: instructorId },
    });
    if (!instructor) {
      throw new NotFoundException('Instrutor não encontrado.');
    }

    // Verificar se já existe um treino com este título para este aluno
    const existingWorkout = await this.workoutRepository.findOne({
      where: {
        member: { id: memberId },
        title: template.title,
      },
    });

    // Se já existe, retornar os treinos sem criar um novo
    if (existingWorkout) {
      return this.workoutsService.getTrainingForMember(memberId);
    }

    // Criar workout baseado no template
    const workout = this.workoutRepository.create({
      title: template.title,
      description: template.description || `Treino baseado no template: ${template.title}`,
      member,
      instructor,
      isActive: true,
    });
    const savedWorkout = await this.workoutRepository.save(workout);

    // Criar workout items baseados nos template items
    for (const templateItem of template.items) {
      const workoutItem = this.workoutItemRepository.create({
        workout: savedWorkout,
        exercise: templateItem.exercise,
        sets: templateItem.sets,
        repetitions: templateItem.repetitions,
        weight: templateItem.weight,
        restTime: templateItem.restTime,
        observations: templateItem.observations,
      });
      await this.workoutItemRepository.save(workoutItem);
    }

    // Retornar os treinos no formato esperado pelo frontend
    return this.workoutsService.getTrainingForMember(memberId);
  }

  async update(
    id: string,
    dto: CreateWorkoutTemplateDto,
    instructorId: string,
  ) {
    const template = await this.findOne(id);

    // Verificar se o template pertence ao instrutor
    if (template.instructor.id !== instructorId) {
      throw new NotFoundException('Template não encontrado ou sem permissão.');
    }

    // Atualizar dados básicos do template
    template.title = dto.title;
    template.description = dto.description || null;
    template.updatedAt = new Date();
    await this.templateRepository.save(template);

    // Deletar items antigos
    await this.templateItemRepository.delete({ template: { id } });

    // Criar novos items
    for (const itemDto of dto.items) {
      // Buscar ou criar exercício
      let exercise = await this.exerciseRepository.findOne({
        where: { name: itemDto.exerciseName },
      });

      if (!exercise) {
        exercise = this.exerciseRepository.create({
          name: itemDto.exerciseName,
          muscleGroup: 'Não especificado',
          description: null,
        });
        exercise = await this.exerciseRepository.save(exercise);
      }

      // Extrair restTime
      const restTimeStr = itemDto.rest?.replace(/[^0-9]/g, '') || '60';
      const restTime = parseInt(restTimeStr) || 60;

      // Criar item do template
      const templateItem = this.templateItemRepository.create({
        template,
        exercise,
        sets: itemDto.sets,
        repetitions: this.extractRepetitions(itemDto.reps),
        weight: itemDto.weight && itemDto.weight > 0 ? itemDto.weight : null,
        restTime,
        observations: itemDto.observations || null,
      });
      await this.templateItemRepository.save(templateItem);
    }

    return this.findOne(id);
  }

  async delete(id: string, instructorId: string) {
    const template = await this.findOne(id);
    
    // Verificar se o template pertence ao instrutor
    if (template.instructor.id !== instructorId) {
      throw new NotFoundException('Template não encontrado ou sem permissão.');
    }

    await this.templateRepository.delete(id);
    return { message: 'Template deletado com sucesso.' };
  }

  private extractRepetitions(reps: string): number {
    // Extrair o primeiro número de "8-12" ou "10"
    const repsStr = reps.replace(/[^0-9-]/g, '');
    const repsMatch = repsStr.match(/(\d+)/);
    return repsMatch ? parseInt(repsMatch[1]) : 10;
  }
}

