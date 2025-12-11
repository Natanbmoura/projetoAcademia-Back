import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Workout } from '../../workouts/entities/workout.entity';

@Entity('workout_history')
export class WorkoutHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' })
  member: Member;

  
  @ManyToOne(() => Workout, { nullable: true })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column({ type: 'timestamp' })
  startTime: Date; 

  @Column({ type: 'timestamp' })
  endTime: Date; 

  @Column({ default: 0 })
  xpEarned: number; 

  @CreateDateColumn()
  createdAt: Date; 
}