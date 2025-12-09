import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(@Body() dto: CreateInstructorDto) {
    return this.instructorsService.create(dto);
  }

  @Get()
  findAll() {
    return this.instructorsService.findAll();
  }
}

