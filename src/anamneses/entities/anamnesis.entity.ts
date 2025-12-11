import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity('anamneses')
export class Anamnesis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento 1 para 1: Um aluno tem UMA anamnese
  @OneToOne(() => Member, (member) => member.anamnesis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' }) 
  member: Member;

  @Column()
  mainGoal: string;

  @Column()
  experienceLevel: string;

  @Column()
  preferredTime: string;

  @Column()
  weeklyFrequency: string;

  @Column({ type: 'text', nullable: true }) // nullable: true porque é opcional
  healthProblems: string;

  @Column({ type: 'text', nullable: true })
  medicalRestrictions: string;

  @Column({ type: 'text', nullable: true })
  medication: string;

  @Column({ type: 'text', nullable: true })
  injuries: string;

  @Column()
  activityLevel: string;

  @Column()
  smokingStatus: string;

  @Column()
  sleepHours: string;

  @CreateDateColumn()
  createdAt: Date;
}