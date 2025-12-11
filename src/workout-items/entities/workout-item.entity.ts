import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Workout } from '../../workouts/entities/workout.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_items')
export class WorkoutItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- RELACIONAMENTOS ---
  
  // Pertence a um Treino (Ex: Treino A)
  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  // Pertence a um Exercício (Ex: Supino)
  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  // --- DADOS DA SÉRIE ---

  @Column()
  sets: number;

  @Column()
  repetitions: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ nullable: true })
  restTime: number; // em segundos

  @Column({ type: 'text', nullable: true })
  observations: string;
}