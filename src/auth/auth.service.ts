import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InstructorsService } from '../instructors/instructors.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateInstructor(id: string, password: string) {
    const instructor = await this.instructorsService.findById(id);
    if (!instructor) return null;

    const ok = await bcrypt.compare(password, instructor.passwordHash);
    return ok ? instructor : null;
  }

  async login(dto: LoginDto) {
    const instructor = await this.validateInstructor(dto.id, dto.password);
    if (!instructor) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: instructor.id, email: instructor.email };
    return {
      accessToken: this.jwtService.sign(payload),
      instructorId: instructor.id,
    };
  }
}

