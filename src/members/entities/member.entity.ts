import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';

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

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'createdByInstructorId' })
  createdByInstructor: Instructor;

  @CreateDateColumn()
  createdAt: Date;
}


