import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { Anamnesis } from '../../anamneses/entities/anamnesis.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

 
  @Column()
  emergencyPhone: string;

  @Column()
  emergencyEmail: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ default: 0 })
  xp: number; 

  @Column({ default: 1 })
  level: number; 

  @Column({ default: 0 })
  currentStreak: number; 

  @Column({ default: 'light' })
  theme: string; 

  @Column({ default: true })
  notifyWorkout: boolean; 

  @Column({ default: true })
  notifyAchievements: boolean; 

  @Column({ default: true })
  notifyRanking: boolean; 

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ default: true })
  needsPasswordChange: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'createdByInstructorId' })
  createdByInstructor: Instructor;

  @OneToOne(() => Anamnesis, (anamnesis) => anamnesis.member)
  anamnesis: Anamnesis;

  @CreateDateColumn()
  createdAt: Date;
}