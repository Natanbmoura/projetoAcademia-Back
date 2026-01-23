import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { WorkoutTemplateItem } from './workout-template-item.entity';

@Entity('workout_templates')
export class WorkoutTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Instructor, { nullable: false })
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor;

  @OneToMany(() => WorkoutTemplateItem, (item) => item.template, {
    cascade: true,
    eager: true,
  })
  items: WorkoutTemplateItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

