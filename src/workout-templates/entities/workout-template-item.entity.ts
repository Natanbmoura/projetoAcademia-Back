import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkoutTemplate } from './workout-template.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_template_items')
export class WorkoutTemplateItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkoutTemplate, (template) => template.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template: WorkoutTemplate;

  @ManyToOne(() => Exercise, { nullable: false })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column()
  sets: number;

  @Column()
  repetitions: number;

  @Column({ type: 'float', nullable: true })
  weight: number | null;

  @Column({ nullable: true })
  restTime: number;

  @Column({ type: 'text', nullable: true })
  observations: string | null;
}

