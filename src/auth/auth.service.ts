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
      console.log(`[Auth] Instrutor não encontrado para email: ${normalizedEmail}`);
      return null;
    }

    const ok = await bcrypt.compare(password, instructor.passwordHash);
    if (!ok) {
      console.log(`[Auth] Senha incorreta para email: ${normalizedEmail}`);
    }
    return ok ? instructor : null;
  }

  async login(dto: LoginDto) {
    // O email já vem normalizado do DTO transform
    const normalizedEmail = dto.email;
    
    console.log(`[Auth] Tentativa de login para email: ${normalizedEmail}`);
    
    const instructor = await this.validateInstructor(normalizedEmail, dto.password);
    
    if (!instructor) {
      console.log(`[Auth] Login falhou - credenciais inválidas para email: ${normalizedEmail}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    console.log(`[Auth] Login bem-sucedido para instrutor: ${instructor.name} (${instructor.email})`);

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
    
    console.log(`[Auth] Tentativa de login de membro para email: ${normalizedEmail}`);
    
    const member = await this.membersService.validateMember(normalizedEmail, dto.password);
    
    if (!member) {
      console.log(`[Auth] Login de membro falhou - credenciais inválidas para email: ${normalizedEmail}`);
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    
    console.log(`[Auth] Login bem-sucedido para membro: ${member.name} (${member.email})`);

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


