import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Workout } from '../../workouts/entities/workout.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('workout_items')
export class WorkoutItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;


  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;



  @Column()
  sets: number;

  @Column()
  repetitions: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ nullable: true })
  restTime: number; 

  @Column({ type: 'text', nullable: true })
  observations: string;
}