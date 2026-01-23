import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkoutTemplatesService } from './workout-templates.service';
import { CreateWorkoutTemplateDto } from './dto/create-workout-template.dto';
import { ApplyTemplateDto } from './dto/apply-template.dto';

@UseGuards(JwtAuthGuard)
@Controller('workout-templates')
export class WorkoutTemplatesController {
  constructor(
    private readonly templatesService: WorkoutTemplatesService,
  ) {}

  @Post()
  create(@Body() dto: CreateWorkoutTemplateDto, @Req() req) {
    const instructorId = req.user.instructorId || req.user.sub;
    return this.templatesService.create(dto, instructorId);
  }

  @Get()
  findAll(@Req() req) {
    const instructorId = req.user.instructorId || req.user.sub;
    return this.templatesService.findAll(instructorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post('apply')
  applyTemplate(@Body() dto: ApplyTemplateDto, @Req() req) {
    const instructorId = req.user.instructorId || req.user.sub;
    return this.templatesService.applyTemplate(
      dto.templateId,
      dto.memberId,
      instructorId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateWorkoutTemplateDto,
    @Req() req,
  ) {
    const instructorId = req.user.instructorId || req.user.sub;
    return this.templatesService.update(id, dto, instructorId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    const instructorId = req.user.instructorId || req.user.sub;
    return this.templatesService.delete(id, instructorId);
  }
}



