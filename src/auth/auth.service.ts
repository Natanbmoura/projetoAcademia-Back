import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InstructorsService } from '../instructors/instructors.service';
import { MembersService } from '../members/members.service';
import { LoginDto } from './dto/login.dto';
import { MemberLoginDto } from './dto/member-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateInstructor(email: string, password: string) {
    // Normalizar email antes de buscar
    const normalizedEmail = email.trim().toLowerCase();
    const instructor = await this.instructorsService.findByEmail(normalizedEmail);
    
    if (!instructor) {
      return null;
    }

    const ok = await bcrypt.compare(password, instructor.passwordHash);
    return ok ? instructor : null;
  }

  async login(dto: LoginDto) {
    // O email já vem normalizado do DTO transform
    const normalizedEmail = dto.email;
    
    const instructor = await this.validateInstructor(normalizedEmail, dto.password);
    
    if (!instructor) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: instructor.id, email: instructor.email };
    return {
      accessToken: this.jwtService.sign(payload),
      instructorId: instructor.id,
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
      },
    };
  }

  async memberLogin(dto: MemberLoginDto) {
    const normalizedEmail = dto.email;
    
    const member = await this.membersService.validateMember(normalizedEmail, dto.password);
    
    if (!member) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const payload = { sub: member.id, email: member.email, role: 'member' };
    return {
      accessToken: this.jwtService.sign(payload),
      memberId: member.id,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
      },
      needsPasswordChange: member.needsPasswordChange,
    };
  }

  async changeMemberPassword(memberId: string, newPassword: string) {
    return this.membersService.changePassword(memberId, newPassword);
  }
}


